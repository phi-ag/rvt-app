import { defineConfig } from "@solidjs/start/config";

import { revision, version } from "./utils/version.js";

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
