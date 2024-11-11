import {
  type Directory,
  type Entry,
  type Header,
  parseDirectory,
  parseHeader
} from "~/lib/cfb";

import { type FileInfo, parseFileInfo } from "./info";
import { parsePreview } from "./thumbnail";

type Boundaries = [start: number, end: number];

const entryBoundaries = (
  header: Header,
  miniFatStart: number,
  file: Entry
): Boundaries => {
  // see https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L651
  if (file.size < header.sectorSize) {
    const miniFatSectorSize = 64;
    const start = miniFatStart + file.start * miniFatSectorSize;
    const end = start + file.size;
    return [start, end];
  }

  const start = (file.start + 1) * header.sectorSize;
  const end = start + file.size;
  return [start, end];
};

interface DesiredFile {
  name: string;
  start: number;
  end: number;
  fn: (data: Uint8Array) => unknown;
}

interface DesiredFileResult {
  name: string;
  result: unknown;
}

const addDesiredFile = (files: DesiredFile[], file: DesiredFile) => {
  files.push(file);
  files.sort((lhs, rhs) => rhs.start - lhs.start);
};

const addDesiredDirectoryFile = (
  header: Header,
  directory: Directory,
  miniFatStart: number,
  files: DesiredFile[],
  name: string,
  fn: (data: Uint8Array) => unknown
) => {
  const entry = directory.find((entry) => entry.name === name);
  if (!entry) throw Error(`Compound file ${name} not found`);

  const [start, end] = entryBoundaries(header, miniFatStart, entry);
  addDesiredFile(files, { name, start, end, fn });
};

export const processFile = async (file: File): Promise<[FileInfo, Blob]> => {
  let chunkEnd = 0;

  let header!: Header;
  let directory!: Directory;

  const desiredFiles: DesiredFile[] = [];
  const desiredFileResults: DesiredFileResult[] = [];

  // Temporary storage for data which crosses chunk boundaries.
  // Use this only for small files (ie. <50kb)!
  let buffer!: Uint8Array | null;

  const addToBuffer = (chunk: Uint8Array) => {
    if (buffer) {
      const next = new Uint8Array(buffer.byteLength + chunk.byteLength);
      next.set(buffer);
      next.set(chunk, buffer.byteLength);
      buffer = next;
    } else {
      buffer = chunk.slice();
    }
  };

  const clearBuffer = () => (buffer = null);

  const prependBuffer = (chunk: Uint8Array) => {
    if (buffer) {
      const result = new Uint8Array(buffer.byteLength + chunk.byteLength);
      result.set(buffer);
      result.set(chunk, buffer.byteLength);
      clearBuffer();
      return result;
    } else {
      return chunk;
    }
  };

  const stream = file.stream();
  try {
    for await (const chunk of stream) {
      const chunkStart = chunkEnd;
      chunkEnd += chunk.byteLength;

      if (!header) {
        console.debug("Initial chunk", chunk.length);

        // TODO: accumulate data if necessary
        if (chunk.length < 512)
          throw Error(`Compound file first chunk too small (${chunk.length})`);

        header = parseHeader(chunk, file.size);
        console.debug("Header", header);
      }

      if (!directory) {
        // TODO: implement finding the directory sector
        // see https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L590
        const directoryStart = header.sectorSize * 2;

        // Directory start not in this chunk
        if (directoryStart > chunkEnd) continue;

        const directorySize = header.sectorSize * header.directorySectorCount;
        const directoryEnd = directoryStart + directorySize;

        const directoryStartChunk = Math.max(directoryStart - chunkStart, 0);

        // Directory end not in this chunk
        if (directoryEnd > chunkEnd) {
          addToBuffer(chunk.subarray(directoryStartChunk));
          continue;
        }

        const directoryEndChunk = directoryEnd - chunkStart;
        const directorySector = prependBuffer(
          chunk.subarray(directoryStartChunk, directoryEndChunk)
        );

        directory = parseDirectory(header, directorySector);
        console.debug("Directory", directory);

        const root = directory.find((entry) => entry.type === 5)!;
        if (!root) throw Error("Compound file root not found");

        const miniFatStart = (root.start + 1) * header.sectorSize;

        addDesiredDirectoryFile(
          header,
          directory,
          miniFatStart,
          desiredFiles,
          "BasicFileInfo",
          parseFileInfo
        );

        addDesiredDirectoryFile(
          header,
          directory,
          miniFatStart,
          desiredFiles,
          "RevitPreview4.0",
          parsePreview
        );
      }

      let nextChunk = false;
      while (!nextChunk && desiredFiles.length) {
        const desiredFile = desiredFiles[desiredFiles.length - 1];
        if (!desiredFile) throw Error("Desired file is undefined (unreachable)");

        // NOTE: Start not in this chunk
        if (desiredFile.start > chunkEnd) {
          nextChunk = true;
          continue;
        }

        // NOTE: If start was in a previous chunk use zero as start
        const startChunk = Math.max(desiredFile.start - chunkStart, 0);

        // NOTE: End not in this chunk
        if (desiredFile.end > chunkEnd) {
          addToBuffer(chunk.subarray(startChunk));
          nextChunk = true;
          continue;
        }

        const fileEndChunk = desiredFile.end - chunkStart;
        const data = prependBuffer(chunk.subarray(startChunk, fileEndChunk));

        desiredFileResults.push({ name: desiredFile.name, result: desiredFile.fn(data) });
        desiredFiles.pop();
      }

      if (!desiredFiles.length) break;
    }
  } finally {
    stream.cancel();
  }

  const info = desiredFileResults.find((file) => file.name === "BasicFileInfo");
  if (!info?.result) throw Error("Missing BasicFileInfo result");

  const blob = desiredFileResults.find((file) => file.name === "RevitPreview4.0");
  if (!blob?.result) throw Error("Missing RevitPreview4.0 result");

  return [info.result as FileInfo, blob.result as Blob] as const;
};

export interface ProcessFileSuccess {
  ok: true;
  name: string;
  info: FileInfo;
  thumbnail: Blob;
  error?: never;
}

export interface ProcessFileError {
  ok: false;
  name: string;
  info?: never;
  thumbnail?: never;
  error: string;
}

export type ProcessFileResult = ProcessFileSuccess | ProcessFileError;

export const tryProcessFile = async (file: File): Promise<ProcessFileResult> => {
  try {
    const [info, thumbnail] = await processFile(file);
    return { ok: true, name: file.name, info, thumbnail };
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Failed to process file ${file.name}`, e);
      return { ok: false, name: file.name, error: e.message };
    }

    throw e;
  }
};

export const processFiles = (files: File[]): Promise<ProcessFileResult[]> =>
  Promise.all(files.map(tryProcessFile));
