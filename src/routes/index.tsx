import {
  type Component,
  For,
  type JSXElement,
  Match,
  Show,
  Switch,
  createSignal
} from "solid-js";

import { DropZone } from "~/components";
import { ThemeToggle } from "~/icons/Animated";
import { GitHub } from "~/icons/GitHub";
import { VerifiedUser } from "~/icons/Material";
import { type ProcessFileResult, processFiles } from "~/lib/revit";
import { useTheme } from "~/lib/theme";

const Navigation: Component = () => {
  const { theme, toggle } = useTheme();

  return (
    <header class="flex h-12 flex-none items-center justify-end gap-3 px-5">
      <button aria-label="Toggle theme" onClick={() => toggle()}>
        <ThemeToggle theme={theme()} />
      </button>
      <a
        class="h-6 w-6"
        href="https://github.com/phi-ag/rvt-app"
        target="_blank"
        aria-label="GitHub"
      >
        <GitHub />
      </a>
    </header>
  );
};

export default function (): JSXElement {
  const [processing, setProcessing] = createSignal(false);
  const [results, setResults] = createSignal<ProcessFileResult[]>();

  const process = async (files: File[]): Promise<void> => {
    setProcessing(true);
    try {
      setResults(await processFiles(files));
    } finally {
      setProcessing(false);
    }
  };

  const acceptExtensions = ["rvt", "rte", "rfa", "rft"];

  const extensions = acceptExtensions.map((ext) => `.${ext}`).join(" | ");

  return (
    <div class="flex flex-1 flex-col overflow-hidden">
      <Navigation />
      <main class="flex flex-1 flex-col gap-4 p-5 pb-5 pt-1">
        <DropZone
          class="min-h-64 flex-1 self-stretch bg-surface-container"
          acceptExtensions={acceptExtensions}
          onFiles={process}
          disabled={processing()}
          data-testid="dropzone"
        >
          <div class="mx-2 flex flex-col items-center gap-1">
            <h1 class="text-display-sm">Revit File Info</h1>
            <p class="text-title">
              {processing() ? "Processing ..." : "Drag 'n' drop or click to select files"}
            </p>
            <p>{extensions}</p>
            <p class="mt-2">
              <VerifiedUser class="-mt-[2px] mr-1 inline-flex" />
              Files are processed locally and never transmitted over the network
            </p>
          </div>
        </DropZone>
        <For each={results()}>
          {(result) => (
            <div class="flex flex-col gap-1 [&>div]:truncate">
              <h2 class="truncate text-headline-sm" data-testid="name">
                {result.name}
              </h2>
              <Switch>
                <Match when={result.ok}>
                  <Show when={result.thumbnail}>
                    <img
                      width={128}
                      height={128}
                      src={URL.createObjectURL(result.thumbnail!)}
                      alt={result.name}
                      class="rounded-lg"
                    />
                  </Show>
                  <div>
                    Version: <span data-testid="version">{result.info?.version}</span>
                  </div>
                  <div>
                    Build: <span data-testid="build">{result.info?.build}</span>
                  </div>
                  <div>
                    Locale: <span data-testid="locale">{result.info?.locale}</span>
                  </div>
                  <div>
                    Identity:{" "}
                    <span data-testid="identityId">{result.info?.identityId}</span>
                  </div>
                  <div>
                    Document:{" "}
                    <span data-testid="documentId">{result.info?.documentId}</span>
                  </div>
                  <div>
                    Path: <span data-testid="path">{result.info?.path}</span>
                  </div>
                  <pre
                    class="mt-2 truncate whitespace-pre-wrap break-words"
                    data-testid="content"
                  >
                    {result.info?.content}
                  </pre>
                </Match>
                <Match when={!result.ok}>
                  <div>
                    Error: <span data-testid="error">{result.error}</span>
                  </div>
                </Match>
              </Switch>
            </div>
          )}
        </For>
      </main>
    </div>
  );
}
