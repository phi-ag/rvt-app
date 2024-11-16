/**
 * ## Compound File Binary Format
 *
 * - https://en.wikipedia.org/wiki/Compound_File_Binary_Format
 * - https://github.com/SheetJS/js-cfb
 * - https://github.com/ifedoroff/compound-file-js
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
const readDate = (view: DataView, offset: number) => {
  return new Date(
    ((view.getUint32(offset + 4, true) / 1e7) * Math.pow(2, 32) +
      view.getUint32(offset, true) / 1e7 -
      11644473600) *
      1000
  );
};

export type Boundaries = [start: number, end: number];

export const entryBoundaries = (
  header: Header,
  miniFatStart: number,
  file: Entry
): Boundaries => {
  // see https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L651
  if (file.size <= header.miniFatCutoff) {
    const start = miniFatStart + file.start * header.miniFatSectorSize;
    const end = start + file.size;
    return [start, end];
  }

  const start = (file.start + 1) * header.sectorSize;
  const end = start + file.size;
  return [start, end];
};

const signature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

export type Version = 3 | 4;

export interface Header {
  version: Version;
  sectorSize: number;
  miniFatSectorSize: number;
  sectorCount: number;
  directorySectorCount: number;
  fatSectorCount: number;
  directoryStart: number;
  miniFatCutoff: number;
  miniFatStart: number;
  miniFatSectorCount: number;
  diFatStart: number;
  diFatCount: number;
  fatSectors: number[];
}

/**
 * Parse CFB header
 *
 * - https://github.com/ifedoroff/compound-file-js/blob/master/src/Header.ts
 * - https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L355
 */
export const parseHeader = (chunk: Uint8Array, fileSize: number): Header => {
  assertEqual(chunk, 0, signature, "signature");
  assertEqual(chunk, 24, [0x3e, 0x00], "minor version");

  const view = new DataView(chunk.buffer);
  const version = view.getUint16(26, true) as Version;
  if (version !== 3 && version !== 4)
    throw Error(`Unexpected compound file major version (${version})`);

  assertEqual(chunk, 28, [0xfe, 0xff], "byte order");

  const sectorSize = 1 << view.getInt16(30, true);
  const sectorCount = Math.ceil(fileSize / sectorSize) - 1;
  const miniFatSectorSize = 1 << view.getInt16(32, true);

  assertZero(chunk, 34, 6, "reserved");

  const directorySectorCount = view.getInt32(40, true);
  if (version === 3 && directorySectorCount !== 0)
    throw Error(`Unexpected compound file sector count (${directorySectorCount})`);

  const fatSectorCount = view.getInt32(44, true);
  const directoryStart = view.getInt32(48, true);

  assertZero(chunk, 52, 4, "transaction signature");

  const miniFatCutoff = view.getInt32(56, true);
  const miniFatStart = view.getInt32(60, true);
  const miniFatSectorCount = view.getInt32(64, true);
  const diFatStart = view.getInt32(68, true);
  const diFatCount = view.getInt32(72, true);

  const fatSectors = [];
  const stride = 4;
  for (let q = -1, i = 0; i < 109; ++i) {
    q = view.getInt32(76 + i * stride, true);
    if (q < 0) break;
    fatSectors[i] = q;
  }

  return {
    version,
    sectorSize,
    miniFatSectorSize,
    sectorCount,
    directorySectorCount,
    fatSectorCount,
    directoryStart,
    miniFatCutoff,
    miniFatStart,
    miniFatSectorCount,
    diFatStart,
    diFatCount,
    fatSectors
  };
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
 */
export const parseDirectory = (header: Header, sector: Uint8Array): Directory => {
  const entryCount = header.version === 3 ? 4 : 32;

  const entries = [];
  for (let i = 0; i < header.directorySectorCount; i++) {
    const start = i * header.sectorSize;
    const end = start + header.sectorSize;
    const sectorEntries = parseDirectorySector(entryCount, sector.subarray(start, end));
    for (const entry of sectorEntries) entries.push(entry);
  }

  return entries;
};
