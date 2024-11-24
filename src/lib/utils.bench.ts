import { bench, describe } from "vitest";

import { toHex } from "./utils";

describe.skip("toHex", async () => {
  const toHexArrays = (array: Uint8Array) =>
    Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const toHexReduce = (array: Uint8Array) =>
    array.reduce((result, value) => (result += value.toString(16).padStart(2, "0")), "");

  const data = new Uint8Array([0x50, 0xc2, 0xc2, 0x53, 0x46, 0xba, 0xd9, 0x01]);
  const expected = "50c2c25346bad901";

  bench("toHex", () => {
    if (toHex(data) !== expected) throw Error("toHex");
  });

  bench("toHexArrays", () => {
    if (toHexArrays(data) !== expected) throw Error("toHexArrays");
  });

  bench("toHexReduce", () => {
    if (toHexReduce(data) !== expected) throw Error("toHexReduce");
  });
});
