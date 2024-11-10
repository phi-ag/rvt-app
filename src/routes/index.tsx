import { createSignal } from "solid-js";

import { DropZone } from "~/components";
import * as array from "~/lib/array";

export default function () {
  const [processing, setProcessing] = createSignal(false);

  const process = async (files: File[]) => {
    setProcessing(true);
    try {
      const file = files[0];
      if (!file) return;
      console.log(file);

      const stream = file.stream();
      console.log(stream);
      //const reader = stream.getReader()

      let index = 0;
      let pos = 0;

      for await (const chunk of stream) {
        if (index === 0) {
          if (chunk.length < 512) throw Error(`First chunk too small (${chunk.length})`);

          const header = chunk.subarray(0, 8);
          const expectedHeader = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
          const validHeader = array.equal(header, expectedHeader);
          if (!validHeader) throw Error("Invalid compound file header");
        }

        index += 1;
        pos += chunk.byteLength;
      }

      console.log(pos, file.size);
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main class="flex flex-1 items-center p-4">
      <DropZone
        class="flex flex-1 items-center justify-center self-stretch"
        acceptExtensions={["rvt", "rte", "rfa", "rft"]}
        onFiles={process}
        disabled={processing()}
      >
        {processing() ? "Processing ..." : "Drag 'n' drop files or click to select files"}
      </DropZone>
    </main>
  );
}
