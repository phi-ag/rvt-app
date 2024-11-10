import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="mx-2 my-4 flex flex-1 items-center justify-center">
      <div class="flex flex-col items-center">
        <h1 class="my-5 truncate text-xl">404 Page Not Found</h1>
        <A href="/">Home</A>
      </div>
    </main>
  );
}
