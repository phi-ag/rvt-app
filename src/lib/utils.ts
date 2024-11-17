export const toHex = (array: Uint8Array) =>
  Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
