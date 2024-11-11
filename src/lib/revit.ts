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

type ParseVersionResult = [version: string, build: string, end: number];

const parseVersion10 = (data: Uint8Array, view: DataView): ParseVersionResult => {
  const versionLengthStart = 14;
  const versionLength = view.getInt32(versionLengthStart, true);

  const versionStart = versionLengthStart + 4;
  const versionEnd = versionStart + versionLength * 2;
  const version = decoder.decode(data.subarray(versionStart, versionEnd));

  const $version = version.slice(15, 20);
  const build = version.slice(28, version.length - 1);

  return [$version, build, versionEnd] as const;
};

const parseVersion13 = (data: Uint8Array, view: DataView): ParseVersionResult => {
  const versionMarkerEnd = findVersionMarker(data);
  if (!versionMarkerEnd) throw Error("Failed to find BasicFileInfo version marker");

  const versionEnd = versionMarkerEnd + 8;
  const version = decoder.decode(data.subarray(versionMarkerEnd, versionEnd));

  const buildLength = view.getInt32(versionEnd, true);
  const buildStart = versionEnd + 4;
  const buildEnd = buildStart + buildLength * 2;
  const build = decoder.decode(data.subarray(buildStart, buildEnd));

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

type ParsePathResult = [path: string, end: number];

const parsePath = (
  data: Uint8Array,
  view: DataView,
  position: number
): ParsePathResult => {
  const length = view.getInt32(position, true);
  const start = position + 4;
  const end = start + length * 2;
  const path = decoder.decode(data.subarray(start, end));

  return [path, end];
};

type ParseGuidsResult = [identityId: string, documentId: string, end: number];

const parseGuids = (
  data: Uint8Array,
  view: DataView,
  position: number
): ParseGuidsResult => {
  // Not sure if actual padding, always 3
  const padding = view.getInt16(position, true);
  const guid1LengthStart = position + 2 + padding;
  const guid1Length = view.getInt32(guid1LengthStart, true);

  const guid1Start = guid1LengthStart + 4;
  const guid1End = guid1Start + guid1Length * 2;
  const guid1 = decoder.decode(data.subarray(guid1Start, guid1End));

  const padding2 = view.getInt16(guid1End, true);

  // Skipping 10 more bytes, contains language maybe (ENU, ENG)? Couldn't figure out how to parse.
  const guid2LengthStart = guid1End + 2 + padding2 + 10;
  const guid2Length = view.getInt32(guid2LengthStart, true);

  const guid2Start = guid2LengthStart + 4;
  const guid2End = guid2Start + guid2Length * 2;
  const guid2 = decoder.decode(data.subarray(guid2Start, guid2End));

  // Guid3 === Guid2 and Guid4 === Guid1 (?)
  const guid3Length = view.getInt32(guid2End, true);
  const guid3Start = guid2End + 4;
  const guid3End = guid3Start + guid3Length * 2;
  //const guid3 = decoder.decode(data.subarray(guid3Start, guid3End));

  const guid4Padding = view.getInt16(guid3End, true);
  const guid4LengthStart = guid3End + 4 + guid4Padding * 2;
  const guid4Length = view.getInt32(guid4LengthStart, true);

  const guid4Start = guid4LengthStart + 4;
  const guid4End = guid4Start + guid4Length * 2;
  //const guid4 = decoder.decode(data.subarray(guid4Start, guid4End));

  return [guid1, guid2, guid4End] as const;
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
  const appNameLength = view.getInt32(position + 1, true);
  const appNameStart = position + 1 + 4;
  const appNameEnd = appNameStart + appNameLength * 2;
  const appName = decoder.decode(data.subarray(appNameStart, appNameEnd));

  if (fileVersion === 13) return [appName, appNameEnd];

  const appName2Length = view.getInt32(appNameEnd, true);
  const appName2Start = appNameEnd + 4;
  const appName2End = appName2Start + appName2Length * 2;
  //const appName2 = decoder.decode(data.subarray(appName2Start, appName2End));

  return [appName, appName2End];
};

type ParseContentStart = [start: number, end: number];

const parseContentStart = (
  fileVersion: FileVersion,
  data: Uint8Array,
  view: DataView,
  position: number
): ParseContentStart => {
  if (fileVersion === 10 || fileVersion === 13)
    return [position + 2, data.byteLength - 2] as const;

  const unknownPaddingFlag = view.getInt8(position);
  const padding = unknownPaddingFlag === 4 ? 5 : 2;
  return [position + padding, data.byteLength - padding] as const;
};

const parseContent = (
  fileVersion: FileVersion,
  data: Uint8Array,
  view: DataView,
  position: number
): string => {
  const [start, end] = parseContentStart(fileVersion, data, view, position);
  return decoder.decode(data.subarray(start, end));
};

export interface FileInfo {
  fileVersion: FileVersion;
  version: string;
  build: string;
  path: string;
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
export const parseBasicFileInfo = (data: Uint8Array): FileInfo => {
  const view = new DataView(data.buffer, data.byteOffset);
  const fileVersion = view.getInt32(0, true);
  if (fileVersion !== 10 && fileVersion !== 13 && fileVersion !== 14)
    throw Error(`Unknown file version ${fileVersion}`);

  const [version, build, versionEnd] = parseVersion(fileVersion, data, view);
  const [path, pathEnd] = parsePath(data, view, versionEnd);
  const [identityId, documentId, guidsEnd] = parseGuids(data, view, pathEnd);
  const [appName, appNameEnd] = parseAppName(fileVersion, data, view, guidsEnd);
  const content = parseContent(fileVersion, data, view, appNameEnd);

  return {
    fileVersion,
    version,
    build,
    path,
    identityId,
    documentId,
    appName,
    content
  };
};
