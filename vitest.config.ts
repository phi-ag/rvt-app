import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  clearScreen: false,
  test: {
    reporters: ["default", "junit"],
    outputFile: {
      junit: "junit.xml"
    },
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts"],
      reportsDirectory: "reports/coverage",
      reporter: ["text", "cobertura"]
    }
  },
  resolve: {
    alias: {
      "~": resolve(import.meta.dirname, "./src")
    }
  }
});
