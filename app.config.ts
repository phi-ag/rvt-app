import { defineConfig } from "@solidjs/start/config";

import { version } from "./package.json";

export const revision = process.env.GITHUB_SHA?.slice(0, 7) ?? "deadbeef";

export default defineConfig({
  middleware: "./src/middleware.ts",
  server: {
    preset: "cloudflare-pages",
    compatibilityDate: "2024-11-03"
  },
  vite: {
    define: {
      "import.meta.env.VERSION": JSON.stringify(version),
      "import.meta.env.REVISION": JSON.stringify(revision)
    }
  }
});
