const decoder = new TextDecoder("utf-16le");

export type FileVersion = 10 | 13 | 14;

const findVersionMarker = (data: Uint8Array): number | undefined => {
  const versionMarker = [0x04, 0x00, 0x00, 0x00];

  for (let i = 0; i < data.length - 4; i++) {
    if (
      data[i] === versionMarker[0] &&
      data[i + 1] === versionMarker[1] &&
      data[i + 2] === versionMarker[2] &&
      data[i + 3] === versionMarker[3]
    ) {
      return i + 4;
    }
  }
};

type ParseStringResult = [value: string, end: number];

const parseString = (
  data: Uint8Array,
  view: DataView,
  position: number
): ParseStringResult => {
  const length = view.getInt32(position, true);
  if (length > view.byteLength)
    throw Error(`Invalid string length ${length} at ${position}`);

  const start = position + 4;
  const end = start + length * 2;
  const value = decoder.decode(data.subarray(start, end));
  return [value, end] as const;
};

type ParseVersionResult = [version: string, build: string, end: number];

const parseVersion10 = (data: Uint8Array, view: DataView): ParseVersionResult => {
  const versionLengthStart = 14;
  const [version, versionEnd] = parseString(data, view, versionLengthStart);

  const $version = version.slice(15, 19);
  const build = version.slice(28, version.length - 1);

  return [$version, build, versionEnd] as const;
};

const parseVersion13 = (data: Uint8Array, view: DataView): ParseVersionResult => {
  const versionMarkerEnd = findVersionMarker(data);
  if (!versionMarkerEnd) throw Error("Failed to find BasicFileInfo version marker");

  const versionEnd = versionMarkerEnd + 8;
  const version = decoder.decode(data.subarray(versionMarkerEnd, versionEnd));

  const [build, buildEnd] = parseString(data, view, versionEnd);

  return [version, build, buildEnd] as const;
};

const parseVersion = (
  fileVersion: FileVersion,
  data: Uint8Array,
  view: DataView
): ParseVersionResult => {
  if (fileVersion === 10) {
    return parseVersion10(data, view);
  } else {
    return parseVersion13(data, view);
  }
};

type ParseGuidsResult = [
  locale: string,
  identityId: string,
  documentId: string,
  end: number
];

const parseGuids = (
  data: Uint8Array,
  view: DataView,
  position: number
): ParseGuidsResult => {
  // Usually 3, sometimes 4
  //const _unknown = view.getInt16(position, true);

  const padding = 3;
  const guid1LengthStart = position + 2 + padding;
  const [guid1, guid1End] = parseString(data, view, guid1LengthStart);
  const [locale, localeEnd] = parseString(data, view, guid1End);

  // Skipping 5 unknown bytes
  //const _unknown = view.getUint32(localeEnd, true);

  const guid2LengthStart = localeEnd + 5;
  const [guid2, guid2End] = parseString(data, view, guid2LengthStart);

  // Guid3 === Guid2 and Guid4 === Guid1 (?)
  const [_guid3, guid3End] = parseString(data, view, guid2End);

  // Probably some info in this padding
  const guid4Padding = view.getInt16(guid3End, true);
  const guid4LengthStart = guid3End + 4 + guid4Padding * 2;
  const [_guid4, guid4End] = parseString(data, view, guid4LengthStart);

  return [locale, guid1, guid2, guid4End] as const;
};

type ParseAppNameResult = [name1: string | undefined, end: number];

const parseAppName = (
  fileVersion: FileVersion,
  data: Uint8Array,
  view: DataView,
  position: number
): ParseAppNameResult => {
  if (fileVersion === 10) return [undefined, position];

  //const _unknownFlag = view.getInt8(position);
  const [appName, appNameEnd] = parseString(data, view, position + 1);

  if (fileVersion === 13) return [appName, appNameEnd];

  const [_appName2, appName2End] = parseString(data, view, appNameEnd);
  return [appName, appName2End];
};

type ContentBounds = [start: number, end: number];

const contentBounds = (
  fileVersion: FileVersion,
  data: Uint8Array,
  view: DataView,
  position: number
): ContentBounds => {
  if (fileVersion === 10 || fileVersion === 13)
    return [position + 2, data.byteLength - 2] as const;

  const unknownPaddingFlag = view.getInt8(position);
  const padding = unknownPaddingFlag === 4 ? 5 : 2;
  return [position + padding, data.byteLength - padding] as const;
};

/*
 * TODO: Replace utf-8 "True" and "False" ()
 * - [0x46, 0x61, 0x6C, 0x73] -> False
 * - [0x54, 0x72, 0x75, 0x65] -> True
 */
const parseContent = (
  fileVersion: FileVersion,
  data: Uint8Array,
  view: DataView,
  position: number
): string => {
  const [start, end] = contentBounds(fileVersion, data, view, position);
  return decoder.decode(data.subarray(start, end));
};

export interface FileInfo {
  fileVersion: FileVersion;
  version: string;
  build: string;
  path: string;
  locale: string;
  identityId: string;
  documentId: string;
  appName?: string;
  content: string;
}

/**
 * Parse BasicFileInfo
 *
 * This was implemented while staring at a hex editor and guessing what each byte could mean,
 * therefore very likely incomplete and buggy. 🤷
 *
 * File versions:
 * - 10 -> Revit 2017/2018
 * - 13 -> Revit 2019/2020
 * - 14 -> Revit 2021/2022/2023/2024/2025
 */
export const parseFileInfo = (data: Uint8Array): FileInfo => {
  const view = new DataView(data.buffer, data.byteOffset);
  const fileVersion = view.getInt32(0, true);
  if (fileVersion !== 10 && fileVersion !== 13 && fileVersion !== 14)
    throw Error(`Unknown file version ${fileVersion}`);

  const [version, build, versionEnd] = parseVersion(fileVersion, data, view);
  const [path, pathEnd] = parseString(data, view, versionEnd);
  const [locale, identityId, documentId, guidsEnd] = parseGuids(data, view, pathEnd);
  const [appName, appNameEnd] = parseAppName(fileVersion, data, view, guidsEnd);
  const content = parseContent(fileVersion, data, view, appNameEnd);

  return {
    fileVersion,
    version,
    build,
    path,
    locale,
    identityId,
    documentId,
    appName,
    content
  };
};
