import { describe, expect, test } from "vitest";

import { extension } from "./file";

describe("file", () => {
  test("extension", () => {
    expect(extension("file.txt")).toBe("txt");
    expect(extension("file.test.txt")).toBe("txt");
    expect(extension("file.long-extension")).toBe("long-extension");

    expect(extension("file")).toBeUndefined();
    expect(extension("")).toBeUndefined();

    // @ts-expect-error
    expect(extension(null)).toBeUndefined();
  });
});
