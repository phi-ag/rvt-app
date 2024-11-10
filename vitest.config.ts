import { defineConfig } from "vitest/config";

export default defineConfig({
  clearScreen: false,
  test: {
    reporters: ["basic", "junit"],
    outputFile: {
      junit: "junit.xml"
    },
    coverage: {
      all: true,
      include: ["src/**"],
      reportsDirectory: "reports/coverage",
      reporter: ["text", "cobertura", "html"]
    }
  }
});
