import { type FileHandle, open, stat } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { processStream } from "./extract";

interface DisposableStream extends AsyncDisposable {
  file: FileHandle;
  size: number;
  stream: ReadableStream;
}

const disposableStream = async (path: string): Promise<DisposableStream> => {
  const file = await open(path, "r");
  const { size } = await stat(path);

  const stream = file.readableWebStream({
    type: "bytes"
  }) as unknown as ReadableStream;

  return {
    file,
    size,
    stream,
    [Symbol.asyncDispose]: () => file.close()
  };
};

const examplePath = (fileName: string): string =>
  join(import.meta.dirname, "..", "..", "..", "examples", fileName);

const exampleStream = async (fileName: string): Promise<DisposableStream> =>
  disposableStream(examplePath(fileName));

describe("revit", () => {
  test("family 2025", async () => {
    await using stream = await exampleStream("racbasicsamplefamily-2025.rfa");
    const [info, thumbnail] = await processStream(stream.size, stream.stream);

    expect(info.version).toEqual("2025");
    expect(info.build).toEqual("Development Build");
    expect(info.identityId).toEqual("00000000-0000-0000-0000-000000000000");
    expect(info.documentId).toEqual("192933d0-a868-4367-b6b5-ae53e4e948c4");
    expect(info.path).toEqual(
      "C:\\Users\\hansonje\\Desktop\\Downloadable Files\\racbasicsamplefamily.rfa"
    );
    expect(info.content).toMatch(/^Worksharing:/);

    expect(thumbnail).toBeDefined();
  });
});
