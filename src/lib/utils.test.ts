import { describe, expect, test } from "vitest";

import { toHex } from "./utils";

describe("utils", () => {
  test("to hex", () => {
    const data = new Uint8Array([0x50, 0xc2, 0xc2, 0x53, 0x46, 0xba, 0xd9, 0x01]);
    expect(toHex(data)).toEqual("50c2c25346bad901");
  });
});
