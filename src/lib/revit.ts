const decoder = new TextDecoder("utf-16le");

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

export interface FileInfo {
  fileVersion: number;
  version: string;
  build: string;
  path: string;
  guid1: string;
  guid2: string;
  appName: string;
  appName2?: string;
  content: string;
}

/**
 * Parse BasicFileInfo
 *
 * This was implemented while staring at a hex editor and guessing what each byte could mean.
 * Therefore very likely incomplete and buggy.
 */
export const parseBasicFileInfo = (data: Uint8Array): FileInfo => {
  const view = new DataView(data.buffer, data.byteOffset);
  const fileVersion = view.getInt16(0, true);
  if (fileVersion !== 13 && fileVersion !== 14)
    console.warn(`Unknown file version ${fileVersion}`);

  const versionMarkerEnd = findVersionMarker(data);
  if (!versionMarkerEnd) throw Error("Failed to find BasicFileInfo version marker");

  const versionEnd = versionMarkerEnd + 8;
  const version = decoder.decode(data.subarray(versionMarkerEnd, versionEnd));

  const buildLength = view.getInt32(versionEnd, true);
  const buildStart = versionEnd + 4;
  const buildEnd = buildStart + buildLength * 2;
  const build = decoder.decode(data.subarray(buildStart, buildEnd));

  const pathLength = view.getInt32(buildEnd, true);
  const pathStart = buildEnd + 4;
  const pathEnd = pathStart + pathLength * 2;
  const path = decoder.decode(data.subarray(pathStart, pathEnd));

  // Not sure if actual padding, always 3
  const padding = view.getInt16(pathEnd, true);
  const guid1LengthStart = pathEnd + 2 + padding;
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

  //const _unknownFlag = view.getInt8(guid4End);

  const appNameLength = view.getInt32(guid4End + 1, true);
  const appNameStart = guid4End + 1 + 4;
  const appNameEnd = appNameStart + appNameLength * 2;
  const appName = decoder.decode(data.subarray(appNameStart, appNameEnd));

  let appName2!: string;
  let contentStart!: number;
  let contentTrim!: number;

  if (fileVersion === 13) {
    contentTrim = 2;
    contentStart = appNameEnd + 2;
  } else if (fileVersion === 14) {
    const appName2Length = view.getInt32(appNameEnd, true);
    const appName2Start = appNameEnd + 4;
    const appName2End = appName2Start + appName2Length * 2;
    appName2 = decoder.decode(data.subarray(appName2Start, appName2End));

    const unknownPaddingFlag = view.getInt8(appName2End);
    const padding = unknownPaddingFlag === 4 ? 5 : 2;
    contentTrim = unknownPaddingFlag === 4 ? 5 : 2;

    contentStart = appName2End + padding;
  }

  const content = decoder.decode(
    data.subarray(contentStart, data.byteLength - contentTrim)
  );

  return {
    fileVersion,
    version,
    build,
    path,
    guid1,
    guid2,
    appName,
    appName2,
    content
  };
};
