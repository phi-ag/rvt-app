import { assertEqual, assertZero } from "./utils";

export const maxFatSectorsHeader = 109;

export type Version = 3 | 4;

export interface Header {
  version: Version;
  sectorSize: number;
  maxSectorEntries: number;
  sectorSizeBits: number;
  miniSectorSize: number;
  miniSectorSizeBits: number;
  directorySectorCount: number;
  fatSectorCount: number;
  directoryStart: number;
  miniFatCutoff: number;
  miniFatStart: number;
  miniFatSectorCount: number;
  diFatStart: number;
  diFatCount: number;
}

/**
 * Parse CFB header
 *
 * - https://github.com/ifedoroff/compound-file-js/blob/master/src/Header.ts
 * - https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L355
 */
export const parseHeader = (
  chunk: Uint8Array
): [header: Header, fatSectors: Uint32Array] => {
  const signature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  assertEqual(chunk, 0, signature, "signature");
  assertEqual(chunk, 24, [0x3e, 0x00], "minor version");

  const view = new DataView(chunk.buffer, chunk.byteOffset);
  const version = view.getUint16(26, true) as Version;
  if (version !== 3 && version !== 4)
    throw Error(`Unexpected compound file major version (${version})`);

  assertEqual(chunk, 28, [0xfe, 0xff], "byte order");

  const sectorSizeBits = view.getUint16(30, true);
  const sectorSize = 1 << sectorSizeBits;
  const maxSectorEntries = 1 << (sectorSizeBits - 2);

  const miniSectorSizeBits = view.getUint16(32, true);
  const miniSectorSize = 1 << miniSectorSizeBits;

  assertZero(chunk, 34, 6, "reserved");

  const directorySectorCount = view.getUint32(40, true);
  if (version === 3 && directorySectorCount !== 0)
    throw Error(`Unexpected compound file sector count (${directorySectorCount})`);

  const fatSectorCount = view.getUint32(44, true);
  const directoryStart = view.getUint32(48, true);

  assertZero(chunk, 52, 4, "transaction signature");

  const miniFatCutoff = view.getUint32(56, true);
  const miniFatStart = view.getUint32(60, true);
  const miniFatSectorCount = view.getUint32(64, true);
  const diFatStart = view.getUint32(68, true);
  const diFatCount = view.getUint32(72, true);

  const fatSectors = new Uint32Array(fatSectorCount);
  const fatSectorsHeaderCount = Math.min(fatSectorCount, maxFatSectorsHeader);
  for (let i = 0; i < fatSectorsHeaderCount; ++i) {
    fatSectors[i] = view.getUint32(76 + i * 4, true);
  }

  const header: Header = {
    version,
    sectorSize,
    sectorSizeBits,
    maxSectorEntries,
    miniSectorSize,
    miniSectorSizeBits,
    directorySectorCount,
    fatSectorCount,
    directoryStart,
    miniFatCutoff,
    miniFatStart,
    miniFatSectorCount,
    diFatStart,
    diFatCount
  };

  return [header, fatSectors] as const;
};
