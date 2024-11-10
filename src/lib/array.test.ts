import { describe, expect, test } from "vitest";

import { isEqual, isZero } from "./array";

describe("array", () => {
  test("equal", () => {
    expect(isEqual([], [])).toBeTruthy();
    expect(isEqual([1], [1])).toBeTruthy();
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBeTruthy();

    expect(isEqual([], [1])).toBeFalsy();
    expect(isEqual([1], [2])).toBeFalsy();

    const a = [1, 2, 3];
    expect(isEqual(a, a)).toBeTruthy();
    expect(isEqual(a, Uint8Array.from(a))).toBeTruthy();

    // @ts-expect-error
    expect(isEqual(null, [1])).toBeFalsy();
    // @ts-expect-error
    expect(isEqual([1], null)).toBeFalsy();
    // @ts-expect-error
    expect(isEqual(null, undefined)).toBeFalsy();
  });

  test("isZero", () => {
    expect(isZero([0, 0, 0])).toBeTruthy();
    expect(isZero([0, 0, 1])).toBeFalsy();

    expect(isZero([])).toBeFalsy();
    // @ts-expect-error
    expect(isZero(null)).toBeFalsy();
  });
});
