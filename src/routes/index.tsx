import { Show, createSignal } from "solid-js";

import { DropZone } from "~/components";
import {
  Directory,
  Entry,
  Header,
  decoder,
  parseDirectory,
  parseHeader
} from "~/lib/cfb";

export default function () {
  const [processing, setProcessing] = createSignal(false);
  const [info, setInfo] = createSignal<string>("");

  // TODO:move processing to web worker
  const process = async (files: File[]) => {
    setProcessing(true);
    try {
      // TODO:handle multiple input files
      const file = files[0];
      if (!file) return;
      console.debug(file);

      let chunkEnd = 0;

      let header!: Header;
      let directory!: Directory;

      let root!: Entry;
      let info!: Entry;

      let infoContent!: string;

      let buffer!: Uint8Array | null;

      const addToBuffer = (chunk: Uint8Array) => {
        if (buffer) {
          const next = new Uint8Array(buffer.byteLength + chunk.byteLength);
          next.set(buffer);
          next.set(chunk, buffer.byteLength);
          buffer = next;
        } else {
          buffer = chunk.slice();
        }
      };

      const clearBuffer = () => (buffer = null);

      const prependBuffer = (chunk: Uint8Array) => {
        if (buffer) {
          const result = new Uint8Array(buffer.byteLength + chunk.byteLength);
          result.set(buffer);
          result.set(chunk, buffer.byteLength);
          clearBuffer();
          return result;
        } else {
          return chunk;
        }
      };

      const stream = file.stream();
      try {
        for await (const chunk of stream) {
          const chunkStart = chunkEnd;
          chunkEnd += chunk.byteLength;

          if (!header) {
            console.debug("Initial chunk", chunk.length);

            // TODO: accumulate data if necessary
            if (chunk.length < 512)
              throw Error(`Compound file first chunk too small (${chunk.length})`);

            header = parseHeader(chunk, file.size);
            console.debug("Header", header);
          }

          if (!directory) {
            // TODO: implement finding the directory sector
            // see https://github.com/SheetJS/js-cfb/blob/master/cfb.js#L590
            const directoryStart = header.sectorSize * 2;

            // Directory start not in this chunk
            if (directoryStart > chunkEnd) continue;

            const directorySize = header.sectorSize * header.directorySectorCount;
            const directoryEnd = directoryStart + directorySize;

            const directoryStartChunk = Math.max(directoryStart - chunkStart, 0);

            // Directory end not in this chunk
            if (directoryEnd > chunkEnd) {
              console.log("🚩 Directory across chunk boundaries", directoryStartChunk);
              addToBuffer(chunk.subarray(directoryStartChunk));
              continue;
            }

            const directoryEndChunk = directoryEnd - chunkStart;
            const directorySector = prependBuffer(
              chunk.subarray(directoryStartChunk, directoryEndChunk)
            );

            directory = parseDirectory(header, directorySector);
            console.debug("Directory", directory);

            const $root = directory.find((entry) => entry.type === 5);
            if (!$root) throw Error("Compound file root not found");
            root = $root;

            const $info = directory.find((entry) => entry.name === "BasicFileInfo");
            if (!$info) throw Error("Compound file BasicFileInfo not found");

            info = $info;
          }

          if (!info || !header) throw Error("Parsing header failed... (unreachable)");

          // TODO: cleanup this hack
          const miniFatStart = (root.start + 1) * header.sectorSize;
          const miniFatSectorSize = 64;
          const infoStart = miniFatStart + info.start * miniFatSectorSize;

          // Info start start not in this chunk
          if (infoStart > chunkEnd) continue;

          const infoEnd = infoStart + info.size;
          const infoStartChunk = Math.max(infoStart - chunkStart, 0);

          // Info end not in this chunk
          if (infoEnd > chunkEnd) {
            console.log("🚩 Info across chunk boundaries", infoStartChunk);
            addToBuffer(chunk.subarray(infoStartChunk));
            continue;
          }

          const infoEndChunk = infoEnd - chunkStart;
          const infoSector = prependBuffer(chunk.subarray(infoStartChunk, infoEndChunk));

          infoContent = decoder.decode(infoSector);
          console.log(infoContent);
          setInfo(infoContent);
          break;
        }
      } finally {
        stream.cancel();
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main class="flex flex-1 items-center p-4">
      <DropZone
        class="flex flex-1 items-center justify-center self-stretch p-4"
        acceptExtensions={["rvt", "rte", "rfa", "rft"]}
        onFiles={process}
        disabled={processing()}
      >
        <Show
          when={info()}
          fallback={
            processing()
              ? "Processing ..."
              : "Drag 'n' drop files or click to select files"
          }
        >
          <pre class="text-left text-sm">{info()}</pre>
        </Show>
      </DropZone>
    </main>
  );
}
