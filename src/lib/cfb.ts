/**
 * ## Compound File Binary Format
 *
 * - https://en.wikipedia.org/wiki/Compound_File_Binary_Format
 * - https://github.com/SheetJS/js-cfb
 * - https://github.com/ifedoroff/compound-file-js
 * - https://github.com/p7zip-project/p7zip/blob/master/CPP/7zip/Archive/ComHandler.cpp
 *
 * @module
 */
import * as array from "~/lib/array";

export enum Color {
  Red = 0,
  Black = 1
}

export enum EntryType {
  Unknown = 0,
  Storage = 1,
  Stream = 2,
  RootStorage = 5
}

const assertEqual = (
  chunk: Uint8Array,
  position: number,
  expected: ArrayLike<number>,
  message: string
) => {
  const data = chunk.subarray(position, position + expected.length);
  if (!array.isEqual(data, expected))
    throw Error(`Unexpected compound file ${message} [${data}]`);
};

const assertZero = (
  chunk: Uint8Array,
  position: number,
  length: number,
  message: string
) => {
  const data = chunk.subarray(position, position + length);
  if (!array.isZero(data))
    throw Error(`Unexpected compound file non-zero ${message} [${data}]`);
};

// see https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L669
export const readDate = (view: DataView, offset: number) => {
  const leftShift32Factor = 4294967296; // Math.pow(2, 32)
  const filetimeOffset = 116444736e5;

  const low = view.getUint32(offset, true);
  const high = view.getUint32(offset + 4, true);

  return new Date((high * leftShift32Factor + low) / 1e4 - filetimeOffset);
};

export type Boundary = [start: number, end: number];

export type BoundaryWithOffset = [start: number, end: number, offset: number];

export class Boundaries {
  readonly items: BoundaryWithOffset[] = [];

  add([start, end]: Boundary) {
    const previous = this.items[this.items.length - 1];
    if (previous === undefined) {
      this.items.push([start, end, 0]);
      return;
    }

    const [prevStart, prevEnd, prevOffset] = previous;

    if (prevEnd !== start) {
      const offset = prevEnd - prevStart + prevOffset;
      this.items.push([start, end, offset]);
    } else {
      previous[1] = end;
    }
  }

  size(): number {
    const last = this.items[this.items.length - 1];
    if (last === undefined) return 0;

    const [start, end, offset] = last;
    return end - start + offset;
  }
}

const signature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

export const freeSector = 0xffffffff;
export const endOfChain = 0xfffffffe;
export const maxFatSectorsHeader = 109;

export type Version = 3 | 4;

export interface Header {
  version: Version;
  sectorSize: number;
  maxSectorEntries: number;
  sectorSizeBits: number;
  miniSectorSize: number;
  miniSectorSizeBits: number;
  sectorCount: number;
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
  chunk: Uint8Array,
  fileSize: number
): [header: Header, fatSectors: Uint32Array] => {
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

  // TODO: remove
  const sectorCount = Math.ceil(fileSize / sectorSize) - 1;

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
    sectorCount,
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

const entryNameMaxLength = 64;

const decoder = new TextDecoder("utf-16le");

export interface Entry {
  name: string;
  type: EntryType;
  color: Color;
  left: number;
  right: number;
  child: number;
  clsid: Uint8Array;
  state: number;
  created?: Date;
  modified?: Date;
  start: number;
  size: number;
}

const parseEntry = (data: Uint8Array): Entry => {
  const view = new DataView(data.buffer, data.byteOffset);
  const nameLength = view.getUint16(entryNameMaxLength, true);
  const name = decoder.decode(data.subarray(0, nameLength - 2));

  const type = data[66] as EntryType;
  if (!(type in EntryType)) throw Error(`Unexpected entry type (${type})`);

  const color = data[67] as Color;
  if (!(color in Color)) throw Error(`Unexpected entry color (${color})`);

  const left = view.getInt32(68, true);
  const right = view.getInt32(72, true);
  const child = view.getInt32(76, true);
  const clsid = data.slice(80, 80 + 16);
  const state = view.getInt32(96, true);

  const hasCreated = !array.isZero(data.subarray(100, 108));
  const created = hasCreated ? readDate(view, 100) : undefined;

  const hasModified = !array.isZero(data.subarray(108, 116));
  const modified = hasModified ? readDate(view, 108) : undefined;

  const start = view.getInt32(116, true);
  const size = view.getInt32(120, true);

  return {
    name,
    type,
    color,
    left,
    right,
    child,
    clsid,
    state,
    created,
    modified,
    start,
    size
  };
};

export type Directory = Entry[];

const parseDirectorySector = (entryCount: number, sector: Uint8Array): Directory => {
  const entries = [];
  for (let i = 0; i < entryCount; i++) {
    const start = i * 128;
    const entry = parseEntry(sector.subarray(start, start + 128));
    if (entry.type !== 0) entries.push(entry);
  }

  return entries;
};

/**
 * Parse the CFB directory
 *
 * - https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/60fe8611-66c3-496b-b70d-a504c94c9ace
 * - https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L618
 *
 * TODO: full path
 *
 */
export const parseDirectory = (header: Header, sectors: Uint8Array): Directory => {
  const entryCount = header.version === 3 ? 4 : 32;

  const entries = [];
  for (let i = 0; i < header.directorySectorCount; i++) {
    const start = i * header.sectorSize;
    const end = start + header.sectorSize;
    const sectorEntries = parseDirectorySector(entryCount, sectors.subarray(start, end));
    for (const entry of sectorEntries) entries.push(entry);
  }

  return entries;
};
