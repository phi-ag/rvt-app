import { A } from "@solidjs/router";
import { type JSXElement } from "solid-js";

export default function NotFound(): JSXElement {
  return (
    <main class="mx-2 my-4 flex flex-1 items-center justify-center">
      <div class="flex flex-col items-center">
        <h1 class="my-3 truncate text-headline">404 Page Not Found</h1>
        <A class="text-title" href="/">
          Home
        </A>
      </div>
    </main>
  );
}
