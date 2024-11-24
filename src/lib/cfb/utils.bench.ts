import { bench, describe } from "vitest";

import { readDate } from "./utils";

describe.skip("read date", async () => {
  const readDateBigInt = (view: DataView, offset: number): Date => {
    const filetime = view.getBigUint64(offset, true);
    return new Date(Number(filetime) / 1e4 - 116444736e5);
  };

  const data = new Uint8Array([0x50, 0xc2, 0xc2, 0x53, 0x46, 0xba, 0xd9, 0x01]);
  const view = new DataView(data.buffer, data.byteOffset);

  bench("uint32", () => {
    readDate(view, 0);
  });

  bench("bigint", () => {
    readDateBigInt(view, 0);
  });
});

describe.skip("uint32le", async () => {
  const readUint32LE = function (b: Uint8Array, idx: number): number {
    return b[idx + 3] * (1 << 24) + (b[idx + 2] << 16) + (b[idx + 1] << 8) + b[idx];
  };

  const data = new Uint8Array([0x50, 0xc2, 0xc2, 0x53]);
  const view = new DataView(data.buffer, data.byteOffset);

  bench("custom", () => {
    readUint32LE(data, 0);
  });

  bench("dataview", () => {
    view.getUint32(0);
  });
});
