import { type FileInfo, basicFileInfo, openFile, tryThumbnail } from "@phi-ag/rvt";

export const processFile = async (
  file: File
): Promise<[info: FileInfo, thumbnail: Blob | undefined]> => {
  const cfb = await openFile(file);
  const info = await basicFileInfo(cfb);
  const thumbnail = await tryThumbnail(cfb);

  return [info, thumbnail.ok ? thumbnail.data : undefined] as const;
};

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
