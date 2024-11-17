import { describe, expect, test } from "vitest";

import { readDate } from "./cfb";

describe("cfb", () => {
  test("read date 2023", () => {
    const data = new Uint8Array([0x50, 0xc2, 0xc2, 0x53, 0x46, 0xba, 0xd9, 0x01]);
    const view = new DataView(data.buffer, data.byteOffset);
    expect(readDate(view, 0)).toEqual(new Date("2023-07-19T13:38:39.989Z"));
  });

  test("read date 2024", () => {
    const data = new Uint8Array([0x00, 0x68, 0x63, 0xca, 0x22, 0x7a, 0xda, 0x01]);
    const view = new DataView(data.buffer, data.byteOffset);
    expect(readDate(view, 0)).toEqual(new Date("2024-03-19T17:28:00.384Z"));
  });
});
