import { describe, expect, test } from "vitest";

import { isValidFile } from "./DropZone";

describe("DropZone", () => {
  const emptyFile = new File([], "empty");

  const blob = new Blob(["hello"]);

  const noExtension = new File([blob], "noExtension");
  const extensionA = new File([blob], "noExtension.a");
  const extensionB = new File([blob], "noExtension.b");
  const extensionAA = new File([blob], "noExtension.A");

  test("is valid file", () => {
    expect(isValidFile(emptyFile)).toBeFalsy();
    expect(isValidFile(noExtension)).toBeTruthy();

    expect(isValidFile(noExtension, ["a"])).toBeFalsy();
    expect(isValidFile(extensionA, ["a"])).toBeTruthy();
    expect(isValidFile(extensionB, ["a"])).toBeFalsy();

    expect(isValidFile(extensionAA, ["a"])).toBeTruthy();
  });
});
