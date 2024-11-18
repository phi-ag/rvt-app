import * as array from "~/lib/array";

import { type Header } from "./header";
import { decoder, readDate } from "./utils";

export enum EntryColor {
  Red = 0,
  Black = 1
}

export enum EntryType {
  Unknown = 0,
  Storage = 1,
  Stream = 2,
  RootStorage = 5
}

export interface Entry {
  name: string;
  type: EntryType;
  color: EntryColor;
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

  const maxNameLength = 64;
  const nameLength = view.getUint16(maxNameLength, true);
  const name = decoder.decode(data.subarray(0, nameLength - 2));

  const type = data[66] as EntryType;
  if (!(type in EntryType)) throw Error(`Unexpected entry type (${type})`);

  const color = data[67] as EntryColor;
  if (!(color in EntryColor)) throw Error(`Unexpected entry color (${color})`);

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
