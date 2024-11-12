import { For, Match, Show, Switch, createSignal } from "solid-js";

import { DropZone } from "~/components";
import { type ProcessFileResult, processFiles } from "~/lib/revit";

export default function () {
  const [processing, setProcessing] = createSignal(false);
  const [results, setResults] = createSignal<ProcessFileResult[]>();

  const process = async (files: File[]) => {
    setProcessing(true);
    try {
      setResults(await processFiles(files));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main class="flex flex-1 flex-col gap-4 p-5">
      <DropZone
        class="min-h-64 flex-1 items-center justify-center self-stretch"
        acceptExtensions={["rvt", "rte", "rfa", "rft"]}
        onFiles={process}
        disabled={processing()}
        data-testid="dropzone"
      >
        {processing() ? "Processing ..." : "Drag 'n' drop files or click to select files"}
      </DropZone>
      <For each={results()}>
        {(result) => (
          <div class="flex flex-col gap-1">
            <h2 class="text-2xl" data-testid="name">
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
                  />
                </Show>
                <div>
                  Version: <span data-testid="version">{result.info?.version}</span>
                </div>
                <div>
                  Build: <span data-testid="build">{result.info?.build}</span>
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
                <pre class="mt-2 whitespace-pre-wrap text-sm" data-testid="content">
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
  );
}
