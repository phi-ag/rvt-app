export const toHex = (array: Uint8Array): string => {
  let result = "";
  for (const value of array) {
    result += value.toString(16).padStart(2, "0");
  }
  return result;
};

export const bufferToHex = (buffer: ArrayBuffer): string => toHex(new Uint8Array(buffer));
