import * as array from "~/lib/array";

export const decoder = new TextDecoder("utf-16le");

export const assertEqual = (
  chunk: Uint8Array,
  position: number,
  expected: ArrayLike<number>,
  message: string
) => {
  const data = chunk.subarray(position, position + expected.length);
  if (!array.isEqual(data, expected))
    throw Error(`Unexpected compound file ${message} [${data}]`);
};

export const assertZero = (
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
