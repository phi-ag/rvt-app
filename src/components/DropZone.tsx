import { cva, cx } from "class-variance-authority";
import {
  type JSX,
  type ParentComponent,
  createMemo,
  createSignal,
  splitProps
} from "solid-js";

import { extension } from "~/lib/file";

const dropZone = cva([
  "select-none",
  "appearance-none",
  "rounded-2xl",
  "border-2",
  "border-dashed",
  "outline-hidden",
  "border-gray-400",
  "dark:border-gray-600",
  "hover:ring-4",
  "focus-visible:ring-4",
  "disabled:pointer-events-none",
  "[transition-property:background-color,border,box-shadow]",
  "[transition-timing-function:ease]",
  "[transition-duration:180ms]"
]);

export const isValidFile = (file: File, acceptExtensions?: string[]): boolean => {
  if (!file.size) return false;
  if (acceptExtensions) {
    const ext = extension(file.name);
    if (!ext || !acceptExtensions.includes(ext.toLowerCase())) return false;
  }
  return true;
};

const droppedFiles = (event: DragEvent, acceptExtensions?: string[]): File[] => {
  const files: File[] = [];

  if (event.dataTransfer?.items) {
    for (const item of event.dataTransfer.items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && isValidFile(file, acceptExtensions)) files.push(file);
      }
    }
  } else if (event.dataTransfer?.files) {
    for (const file of event.dataTransfer.files) {
      if (isValidFile(file, acceptExtensions)) files.push(file);
    }
  }

  return files;
};

type OnInputEvent = Parameters<JSX.InputEventHandler<HTMLInputElement, InputEvent>>[0];

const inputFiles = (event: OnInputEvent, acceptExtensions?: string[]): File[] => {
  const files: File[] = [];
  if (event.currentTarget.files) {
    for (const file of event.currentTarget.files) {
      if (isValidFile(file, acceptExtensions)) files.push(file);
    }
  }

  return files;
};

export type DropZoneProps = {
  acceptExtensions?: string[];
  onFiles: (files: File[]) => void;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const DropZone: ParentComponent<DropZoneProps> = (props) => {
  const [dragging, setDragging] = createSignal(false);

  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "acceptExtensions",
    "onFiles"
  ]);

  let inputRef!: HTMLInputElement;

  const onDrop: JSX.EventHandler<HTMLButtonElement, DragEvent> = async (event) => {
    event.preventDefault();
    setDragging(false);
    local.onFiles(droppedFiles(event, props.acceptExtensions));
  };

  const onInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = async (event) => {
    const files = inputFiles(event, props.acceptExtensions);
    inputRef.value = "";
    local.onFiles(files);
  };

  const acceptInput = createMemo(() =>
    props.acceptExtensions?.map((ext) => `.${ext}`).join(",")
  );

  return (
    <button
      {...rest}
      on:dragenter={() => setDragging(true)}
      on:dragleave={() => setDragging(false)}
      on:dragover={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      on:drop={onDrop}
      onClick={() => inputRef.click()}
      class={cx(
        dropZone({
          class: local.class
        }),
        dragging() ? "ring-secondary ring-4" : "ring-primary"
      )}
    >
      <input
        ref={inputRef!}
        type="file"
        multiple
        accept={acceptInput()}
        class="hidden"
        onInput={onInput}
      />
      {local.children}
    </button>
  );
};

export default DropZone;
