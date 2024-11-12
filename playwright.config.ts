import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  testMatch: "e2e/*.e2e.ts",
  outputDir: ".e2e-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  webServer: !process.env.BASE_URL
    ? {
        command: "pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        stdout: "pipe",
        stderr: "pipe"
      }
    : undefined,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    viewport: { width: 1920, height: 1080 }
  },
  reporter: [
    ["html", { open: "never", outputFolder: "reports/e2e" }],
    ["junit", { outputFile: "junit.e2e.xml" }]
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    }
  ]
});
