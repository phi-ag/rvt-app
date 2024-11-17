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
const endOfChain = 0xfffffffe;
const maxFatSectorsHeader = 109;

export const sliceUint8 = async (
  blob: Blob,
  start: number,
  end: number
): Promise<Uint8Array> => new Uint8Array(await blob.slice(start, end).arrayBuffer());

const sliceView = async (blob: Blob, start: number, end: number): Promise<DataView> =>
  new DataView(await blob.slice(start, end).arrayBuffer());

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

const fatSectorChain = (
  name: string,
  fat: Uint32Array,
  start: number,
  length: number
): Uint32Array => {
  const sectors = new Uint32Array(length);

  for (let i = 0, current = start; ; i++) {
    if (current === endOfChain) {
      if (i !== length)
        throw Error(`${name} unexpected end of fat chain (${i} !== ${length})`);
      break;
    }

    if (i >= length) throw Error(`${name} fat chain too long (${i} >= ${length})`);
    sectors[i] = current;

    if (current >= fat.length)
      throw Error(`${name} fat chain out-of-bounds (${current} >= ${fat.length})`);
    current = fat[current];
  }

  return sectors;
};

const directorySectorChain = (header: Header, fat: Uint32Array): Uint32Array =>
  fatSectorChain("Directory", fat, header.directoryStart, header.directorySectorCount);

const miniFatSectorChain = (header: Header, fat: Uint32Array): Uint32Array =>
  fatSectorChain("MiniFat", fat, header.miniFatStart, header.miniFatSectorCount);

export const miniStreamSectorChain = (
  header: Header,
  fat: Uint32Array,
  root: Entry
): Uint32Array => {
  const sectorCount = (root.size + header.sectorSize - 1) >> header.sectorSizeBits;
  return fatSectorChain("MiniStream", fat, root.start, sectorCount);
};

const sectorBounds = (
  header: Header,
  sectors: Uint32Array,
  byteLength?: number
): Boundaries => {
  const bounds = new Boundaries();
  const sectorSize = header.sectorSize;

  for (let i = 0; i < sectors.length; i++) {
    const start = (sectors[i] + 1) * sectorSize;
    const size = byteLength
      ? Math.min(byteLength - i * sectorSize, sectorSize)
      : sectorSize;

    const end = start + size;
    bounds.add([start, end]);
  }

  return bounds;
};

const boundsData = async (blob: Blob, bounds: Boundaries): Promise<Uint8Array> => {
  const data = new Uint8Array(bounds.size());

  for (const [start, end, offset] of bounds.items) {
    const chunk = await sliceUint8(blob, start, end);
    data.set(chunk, offset);
  }

  return data;
};

const boundsEntries = async (blob: Blob, bounds: Boundaries): Promise<Uint32Array> => {
  const entries = new Uint32Array(bounds.size() >> 2);

  for (const [start, end, offset] of bounds.items) {
    const view = await sliceView(blob, start, end);
    const chunkEntries = view.byteLength >> 2;
    const chunkOffset = offset >> 2;
    for (let i = 0; i < chunkEntries; i++) {
      entries[i + chunkOffset] = view.getUint32(i * 4, true);
    }
  }

  return entries;
};

export const createDirectory = async (
  blob: Blob,
  header: Header,
  fat: Uint32Array
): Promise<Directory> => {
  const sectors = directorySectorChain(header, fat);
  const bounds = sectorBounds(header, sectors);
  const data = await boundsData(blob, bounds);
  return parseDirectory(header, data);
};

const fatBounds = (
  header: Header,
  fat: Uint32Array,
  start: number,
  size: number
): Boundaries => {
  const bounds = new Boundaries();

  for (let i = 0, current = start, remaining = size; ; i++) {
    if (current === endOfChain) {
      if (remaining !== 0) throw Error("Fat bounds unexpected end of chain");
      break;
    }

    const start = (current + 1) * header.sectorSize;
    const size = remaining < header.sectorSize ? remaining : header.sectorSize;
    remaining -= size;

    bounds.add([start, start + size]);

    if (current >= fat.length) throw Error(`Fat out-of-bounds (${current})`);
    current = fat[current];
  }

  return bounds;
};

const miniStreamOffset = (
  header: Header,
  miniStreamSectors: Uint32Array,
  start: number
) => {
  const subBits = header.sectorSizeBits - header.miniSectorSizeBits;
  const sector = start >> subBits;
  if (sector >= miniStreamSectors.length)
    throw Error(`MiniStream sector out-of-bounds (${sector})`);

  // Some kind of magic 👀
  // see https://github.com/p7zip-project/p7zip/blob/master/CPP/7zip/Archive/ComHandler.cpp#L152
  const offset =
    ((miniStreamSectors[sector] + 1) << subBits) + (start & ((1 << subBits) - 1));

  return offset * header.miniSectorSize;
};

/**
 * NOTE: Never tested with more than one DIFAT sector
 */
export const addDiFatEntries = async (
  blob: Blob,
  header: Header,
  fatSectors: Uint32Array
) => {
  for (let i = 0, current = header.diFatStart; ; i++) {
    if (current === endOfChain) {
      if (i !== header.diFatCount)
        throw Error(`Unexpected end of diFat chain (${i} !== ${header.diFatCount})`);
      break;
    }

    const diFatStart = (current + 1) * header.sectorSize;
    const diFatEnd = diFatStart + header.sectorSize;
    const diFat = await sliceView(blob, diFatStart, diFatEnd);

    const max = header.maxSectorEntries - 1;
    const offset = i * max + maxFatSectorsHeader;

    const remaining = Math.min(header.fatSectorCount - offset, max);
    if (remaining < 0)
      throw Error(`Unexpected remaining sectors in diFat chain (${remaining})`);

    for (let j = 0; j < remaining; j++) {
      fatSectors[j + offset] = diFat.getUint32(j * 4, true);
    }

    current = diFat.getUint32(max * 4, true);
  }
};

export const createFat = async (
  blob: Blob,
  header: Header,
  fatSectors: Uint32Array
): Promise<Uint32Array> => {
  const fatBounds = sectorBounds(header, fatSectors);
  return await boundsEntries(blob, fatBounds);
};

/**
 * NOTE: Never tested with more than one MiniFat sector
 */
export const createMiniFat = async (
  blob: Blob,
  header: Header,
  fat: Uint32Array,
  root: Entry
): Promise<Uint32Array> => {
  const miniFatSectors = miniFatSectorChain(header, fat);
  const miniFatCount =
    (root.size + (1 << header.miniSectorSizeBits) - 1) >> header.miniSectorSizeBits;

  const miniFatBounds = sectorBounds(header, miniFatSectors, miniFatCount * 4);
  return await boundsEntries(blob, miniFatBounds);
};

export class Cfb {
  readonly #blob: Blob;
  readonly #header: Header;
  readonly #directory: Directory;
  readonly #fat: Uint32Array;
  readonly #miniFat: Uint32Array;
  readonly #miniStreamSectors: Uint32Array;

  constructor(
    blob: Blob,
    header: Header,
    directory: Directory,
    fat: Uint32Array,
    miniFat: Uint32Array,
    miniStreamSectors: Uint32Array
  ) {
    this.#blob = blob;
    this.#header = header;
    this.#directory = directory;
    this.#fat = fat;
    this.#miniFat = miniFat;
    this.#miniStreamSectors = miniStreamSectors;
  }

  static initialize = async (blob: Blob) => {
    if (blob.size < 512) throw Error(`Compound file too small (${blob.size})`);

    const [header, fatSectors] = parseHeader(await sliceUint8(blob, 0, 512));
    //console.debug("Header", header);

    await addDiFatEntries(blob, header, fatSectors);
    const fat = await createFat(blob, header, fatSectors);
    const directory = await createDirectory(blob, header, fat);

    const root = directory.find((entry) => entry.type === 5);
    if (!root) throw Error("Compound file root not found");
    //console.log("root", root);

    const miniFat = await createMiniFat(blob, header, fat, root);
    const miniStreamSectors = miniStreamSectorChain(header, fat, root);

    return new Cfb(blob, header, directory, fat, miniFat, miniStreamSectors);
  };

  findEntry = (name: string) => this.#directory.find((entry) => entry.name === name);

  miniStreamBounds = (start: number, size: number): Boundaries => {
    const bounds = new Boundaries();

    for (let i = 0, current = start, remaining = size; ; i++) {
      if (current === endOfChain) {
        if (remaining !== 0) throw Error("MiniStream bounds unexpected end of chain");
        break;
      }

      const start = miniStreamOffset(this.#header, this.#miniStreamSectors, current);

      const miniSectorSize = this.#header.miniSectorSize;
      const size = remaining < miniSectorSize ? remaining : miniSectorSize;
      remaining -= size;

      bounds.add([start, start + size]);

      if (current >= this.#miniFat.length)
        throw Error(`MiniStream out-of-bounds (${current})`);

      current = this.#miniFat[current];
    }

    return bounds;
  };

  miniStreamData = async (start: number, size: number): Promise<Uint8Array> => {
    const bounds = this.miniStreamBounds(start, size);
    return await boundsData(this.#blob, bounds);
  };

  entryData = async (entry: Entry): Promise<Uint8Array> => {
    if (entry.size < this.#header.miniFatCutoff)
      return await this.miniStreamData(entry.start, entry.size);

    const bounds = fatBounds(this.#header, this.#fat, entry.start, entry.size);
    return await boundsData(this.#blob, bounds);
  };
}
