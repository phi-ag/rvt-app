import {
  addDiFatEntries,
  createDirectory,
  createFat,
  createMiniFat,
  entryData,
  findEntry,
  miniStreamSectorChain,
  parseHeader,
  sliceUint8
} from "~/lib/cfb";

import { type FileInfo, parseFileInfo } from "./info";
import { parsePreview } from "./thumbnail";

export const processBlob = async (
  fileSize: number,
  blob: Blob
): Promise<[info: FileInfo, thumbnail: Blob | undefined]> => {
  if (fileSize < 512) throw Error(`Compound file too small (${fileSize})`);

  const [header, fatSectors] = parseHeader(await sliceUint8(blob, 0, 512), fileSize);
  //console.debug("Header", header);

  await addDiFatEntries(blob, header, fatSectors);
  const fat = await createFat(blob, header, fatSectors);
  const directory = await createDirectory(blob, header, fat);

  const root = directory.find((entry) => entry.type === 5);
  if (!root) throw Error("Compound file root not found");
  //console.log("root", root);

  const miniFat = await createMiniFat(blob, header, fat, root);
  const miniStreamSectors = miniStreamSectorChain(header, fat, root);

  const infoEntry = findEntry(directory, "BasicFileInfo");
  if (!infoEntry) throw Error("BasicFileInfo not found");

  const infoData = await entryData(
    blob,
    header,
    fat,
    miniFat,
    miniStreamSectors,
    infoEntry
  );
  const info = parseFileInfo(infoData);

  const thumbnailEntry = findEntry(directory, "RevitPreview4.0");
  if (!thumbnailEntry) return [info, undefined] as const;

  const thumbnailData = await entryData(
    blob,
    header,
    fat,
    miniFat,
    miniStreamSectors,
    thumbnailEntry
  );
  const thumbnail = parsePreview(thumbnailData);

  return [info, thumbnail] as const;
};

export const processFile = (file: File): Promise<[FileInfo, Blob | undefined]> =>
  processBlob(file.size, file);

export interface ProcessFileSuccess {
  ok: true;
  name: string;
  info: FileInfo;
  thumbnail?: Blob;
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
