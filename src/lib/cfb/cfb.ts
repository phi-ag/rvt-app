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
import { sliceUint8, sliceView } from "./blob";
import { Boundaries } from "./boundaries";
import { type Directory, type Entry, parseDirectory } from "./directory";
import { type Header, maxFatSectorsHeader, parseHeader } from "./header";

const endOfChain = 0xfffffffe;

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

const miniStreamSectorChain = (
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

const createDirectory = async (
  blob: Blob,
  header: Header,
  fat: Uint32Array
): Promise<Directory> => {
  const sectors = directorySectorChain(header, fat);
  const bounds = sectorBounds(header, sectors);
  const data = await boundsData(blob, bounds);
  return parseDirectory(header, data);
};

/**
 * NOTE: Never tested with more than one DIFAT sector
 */
const addDiFatEntries = async (blob: Blob, header: Header, fatSectors: Uint32Array) => {
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

const createFat = async (
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
const createMiniFat = async (
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

  fatBounds = (start: number, size: number): Boundaries => {
    const bounds = new Boundaries();

    for (let i = 0, current = start, remaining = size; ; i++) {
      if (current === endOfChain) {
        if (remaining !== 0) throw Error("Fat bounds unexpected end of chain");
        break;
      }

      const start = (current + 1) * this.#header.sectorSize;
      const size = Math.min(remaining, this.#header.sectorSize);
      remaining -= size;

      bounds.add([start, start + size]);

      if (current >= this.#fat.length) throw Error(`Fat out-of-bounds (${current})`);
      current = this.#fat[current];
    }

    return bounds;
  };

  miniStreamOffset = (start: number) => {
    const subBits = this.#header.sectorSizeBits - this.#header.miniSectorSizeBits;
    const sector = start >> subBits;
    if (sector >= this.#miniStreamSectors.length)
      throw Error(`MiniStream sector out-of-bounds (${sector})`);

    // Some kind of magic 👀
    // see https://github.com/p7zip-project/p7zip/blob/master/CPP/7zip/Archive/ComHandler.cpp#L152
    const offset =
      ((this.#miniStreamSectors[sector] + 1) << subBits) + (start & ((1 << subBits) - 1));

    return offset * this.#header.miniSectorSize;
  };

  miniStreamBounds = (start: number, size: number): Boundaries => {
    const bounds = new Boundaries();

    for (let i = 0, current = start, remaining = size; ; i++) {
      if (current === endOfChain) {
        if (remaining !== 0) throw Error("MiniStream bounds unexpected end of chain");
        break;
      }

      const start = this.miniStreamOffset(current);

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

    const bounds = this.fatBounds(entry.start, entry.size);
    return await boundsData(this.#blob, bounds);
  };
}
