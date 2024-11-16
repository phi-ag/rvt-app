import { type FileHandle, open, stat } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { processStream } from "./extract";
import { type FileInfo } from "./info";

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

type ExpectedFileInfo = Omit<FileInfo, "fileVersion" | "content">;

describe("revit", () => {
  const families: [string, ExpectedFileInfo][] = [
    [
      "rac_basic_sample_family-2016.rfa",
      {
        version: "2016",
        build: "20150110_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "d713e470-f080-49fb-b78e-9e7ea68ec135",
        path: "C:\\Content_Inst_P4\\Release\\2016\\RTM\\Content\\English\\Samples\\RAC\\Samples\\rac_basic_sample_family1.rfa"
      }
    ],
    [
      "rac_basic_sample_family-2017.rfa",
      {
        version: "2017",
        build: "20160130_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "53e280c4-3c42-4b98-89b1-d3fabe12041a",
        path: "C:\\Users\\hansonje\\Box Sync\\FY-2016 Projects\\Revit - 77765 Update Sample Files\\Updated\\rac_basic_sample_family.rfa"
      }
    ],
    [
      "rac_basic_sample_family-2018.rfa",
      {
        version: "2018",
        build: "20170130_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "e3263f66-a12c-4ac6-bb6f-db8effe79d86",
        path: "C:\\Users\\hansonje\\Box Sync\\FY-2017 Projects\\Revit - 105881 Update Sample Files\\To be Updated\\rac_basic_sample_family.rfa"
      }
    ],
    [
      "rac_basic_sample_family-2019.rfa",
      {
        version: "2019",
        build: "20180123_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "d2a42ce9-8cd9-47a3-a4f4-c5dab7807177",
        path: "C:\\Users\\hansonje\\Box Sync\\FY-2019 Projects\\Revit - 126187 Update Sample Files\\Updated Samples\\rac_basic_sample_family.rfa"
      }
    ],
    [
      "racbasicsamplefamily-2020.rfa",
      {
        version: "2020",
        build: "20190207_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "c749ca88-5442-46eb-a706-04db158b688e",
        path: "C:\\Users\\hansonje\\OneDrive - autodesk\\FY-2020 Projects\\Revit - 142304 Update Files for 2020\\2019 Files\\rac_basic_sample_family.rfa"
      }
    ],
    [
      "racbasicsamplefamily-2021.rfa",
      {
        version: "2021",
        build: "20200131_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "f6e393f2-28e2-4430-9a59-775c2dbc185e",
        path: "C:\\Users\\hansonje\\OneDrive - autodesk\\FY-2021 Projects\\Revit - 157775 Update Revit Sample files_datasets\\To Be Updated\\racbasicsamplefamily.rfa"
      }
    ],
    [
      "racbasicsamplefamily-2022.rfa",
      {
        version: "2022",
        build: "20210129_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "db56d7c3-42ec-4f15-9a87-5f36a02d6a65",
        path: "C:\\Users\\hansonje\\OneDrive - Autodesk\\FY-2021 Projects\\Revit - 173339 Update Sample file to 2022\\2021\\racbasicsamplefamily.rfa"
      }
    ],
    [
      "racbasicsamplefamily-2023.rfa",
      {
        version: "2023",
        build: "20220401_1515(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "ffbc1a14-4eb2-47be-bbe7-3cb031688e51",
        path: "C:\\Users\\hansonje\\OneDrive - Autodesk\\FY - 2023\\Revit - 190062 Update Sample Files\\2023\\racbasicsamplefamily.rfa"
      }
    ],
    [
      "racbasicsamplefamily-2024.rfa",
      {
        version: "2024",
        build: "20230308_1635(x64)",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "6110d753-c225-4bf1-a2cf-db67d4326c41",
        path: "C:\\Users\\hansonje\\Desktop\\Revit - 190062 Update Sample Files\\2024\\racbasicsamplefamily.rfa"
      }
    ],
    [
      "racbasicsamplefamily-2025.rfa",
      {
        version: "2025",
        build: "Development Build",
        identityId: "00000000-0000-0000-0000-000000000000",
        documentId: "192933d0-a868-4367-b6b5-ae53e4e948c4",
        path: "C:\\Users\\hansonje\\Desktop\\Downloadable Files\\racbasicsamplefamily.rfa"
      }
    ]
  ];

  test.each(families)("family %s", async (path, expected) => {
    await using stream = await exampleStream(path);
    const [info, thumbnail] = await processStream(stream.size, stream.stream);

    expect(info.version).toEqual(expected.version);
    expect(info.build).toEqual(expected.build);
    expect(info.identityId).toEqual(expected.identityId);
    expect(info.documentId).toEqual(expected.documentId);
    expect(info.path).toEqual(expected.path);
    expect(info.content).toMatch(/^Worksharing:/);

    expect(thumbnail).toBeDefined();
  });
});
