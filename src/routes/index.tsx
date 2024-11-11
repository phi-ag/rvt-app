import { For, Match, Switch, createSignal } from "solid-js";

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
      >
        {processing() ? "Processing ..." : "Drag 'n' drop files or click to select files"}
      </DropZone>
      <For each={results()}>
        {(result) => (
          <div class="flex flex-col gap-1">
            <h2 class="text-2xl">{result.name}</h2>
            <Switch>
              <Match when={result.ok}>
                <img
                  width={128}
                  height={128}
                  src={URL.createObjectURL(result.thumbnail!)}
                  alt={result.name}
                />
                <p>Version: {result.info?.version}</p>
                <p>Build: {result.info?.build}</p>
                <p>Identity: {result.info?.identityId}</p>
                <p>Document: {result.info?.documentId}</p>
                <p>Path: {result.info?.path}</p>
                <pre class="mt-2 whitespace-pre-wrap text-sm">{result.info?.content}</pre>
              </Match>
              <Match when={!result.ok}>
                <p>Error: {result.error}</p>
              </Match>
            </Switch>
          </div>
        )}
      </For>
    </main>
  );
}
