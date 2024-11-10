import { cva } from "class-variance-authority";
import { type JSX, createSignal } from "solid-js";

import * as array from "~/lib/array";
import { extension } from "~/lib/file";

const dropZone = cva(
  [
    "flex",
    "flex-1",
    "items-center",
    "justify-center",
    "self-stretch",
    "select-none",
    "appearance-none",
    "rounded-2xl",
    "border-2",
    "border-dashed",
    "bg-opacity-25",
    "outline-none",
    "hover:bg-gray-100",
    "focus-visible:bg-gray-100",
    "dark:hover:bg-gray-700",
    "dark:focus-visible:bg-gray-700",
    "disabled:pointer-events-none",
    "[transition-property:background-color,border]",
    "[transition-timing-function:ease]",
    "[transition-duration:200ms]"
  ],
  {
    variants: {
      dragging: {
        true: null,
        false: null
      },
      processing: {
        true: null,
        false: null
      }
    },
    compoundVariants: [
      {
        dragging: false,
        class: "border-gray-300 dark:border-gray-600"
      },
      {
        dragging: true,
        class: "border-green-300 bg-green-400 dark:border-green-600"
      },
      {
        processing: false,
        class: "hover:bg-gray-100 dark:hover:bg-gray-700"
      }
    ]
  }
);

const acceptExtensions = ["rvt", "rte", "rfa", "rft"];

const acceptInput = acceptExtensions.map((ext) => `.${ext}`).join(",");

const isValidFile = (file: File): boolean => {
  if (!file.size) return false;
  const ext = extension(file.name);
  if (!ext || !acceptExtensions.includes(ext)) return false;
  return true;
};

const droppedFiles = (event: DragEvent): File[] => {
  const files: File[] = [];

  if (event.dataTransfer?.items) {
    for (const item of event.dataTransfer.items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && isValidFile(file)) files.push(file);
      }
    }
  } else if (event.dataTransfer?.files) {
    for (const file of event.dataTransfer.files) {
      if (isValidFile(file)) files.push(file);
    }
  }

  return files;
};

type OnInputEvent = Parameters<JSX.InputEventHandler<HTMLInputElement, InputEvent>>[0];

const inputFiles = (event: OnInputEvent): File[] => {
  const files: File[] = [];
  if (event.currentTarget.files) {
    for (const file of event.currentTarget.files) {
      if (isValidFile(file)) files.push(file);
    }
  }

  return files;
};

export default function () {
  const [dragging, setDragging] = createSignal(false);
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
          if (chunk.length < 512) throw Error("First chunk too small");

          const header = chunk.subarray(0, 8);
          const expectedHeader = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
          const validHeader = array.equal(header, expectedHeader);
          console.log("Valid header", validHeader);
        }

        index += 1;
        pos += chunk.byteLength;
      }

      console.log(pos, file.size);
      //await new Promise((resolve) => setTimeout(resolve, 1_000));
    } finally {
      setProcessing(false);
    }
  };

  const onDrop: JSX.EventHandler<HTMLButtonElement, DragEvent> = async (event) => {
    event.preventDefault();
    setDragging(false);
    await process(droppedFiles(event));
  };

  const onInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = async (event) => {
    const files = inputFiles(event);
    inputRef.value = "";
    await process(files);
  };

  let inputRef: HTMLInputElement;

  return (
    <main class="flex flex-1 items-center p-4">
      <button
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.click()}
        disabled={processing()}
        class={dropZone({
          dragging: dragging()
        })}
      >
        <input
          ref={inputRef!}
          type="file"
          multiple
          accept={acceptInput}
          class="hidden"
          onInput={onInput}
        />
        {processing()
          ? "Processing ..."
          : dragging()
            ? "Drop the files here ..."
            : "Drag 'n' drop some files here, or click to select files"}
      </button>
    </main>
  );
}
