import { describe, expect, test } from "vitest";

import { equal } from "./array";

describe("array", () => {
  test("equal", () => {
    expect(equal([], [])).toBeTruthy();
    expect(equal([1], [1])).toBeTruthy();
    expect(equal([1, 2, 3], [1, 2, 3])).toBeTruthy();

    expect(equal([], [1])).toBeFalsy();
    expect(equal([1], [2])).toBeFalsy();

    const a = [1, 2, 3];
    expect(equal(a, a)).toBeTruthy();
    expect(equal(a, Uint8Array.from(a))).toBeTruthy();

    // @ts-expect-error
    expect(equal(null, [1])).toBeFalsy();
    // @ts-expect-error
    expect(equal([1], null)).toBeFalsy();
    // @ts-expect-error
    expect(equal(null, undefined)).toBeFalsy();
  });
});
