import { A } from "@solidjs/router";

export default function NotFound() {
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
