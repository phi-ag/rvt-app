import { Cfb } from "~/lib/cfb";

import { type FileInfo, parseFileInfo } from "./info";
import { parsePreview } from "./thumbnail";

const createInfo = async (cfb: Cfb): Promise<FileInfo> => {
  const entry = cfb.findEntry("BasicFileInfo");
  if (!entry) throw Error("Basic file info not found");
  return parseFileInfo(await cfb.entryData(entry));
};

const createThumbnail = async (cfb: Cfb): Promise<Blob | undefined> => {
  const entry = cfb.findEntry("RevitPreview4.0");
  if (!entry) return;
  return parsePreview(await cfb.entryData(entry));
};

export const processBlob = async (
  blob: Blob
): Promise<[info: FileInfo, thumbnail: Blob | undefined]> => {
  const cfb = await Cfb.initialize(blob);
  const info = await createInfo(cfb);
  const thumbnail = await createThumbnail(cfb);

  return [info, thumbnail] as const;
};

export const processFile = (file: File): Promise<[FileInfo, Blob | undefined]> =>
  processBlob(file);

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
