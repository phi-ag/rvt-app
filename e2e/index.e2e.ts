import { expect, test } from "@playwright/test";

import { throwOnConsoleError } from "./utils.js";

test.describe("e2e", () => {
  test("title", async ({ page }) => {
    throwOnConsoleError(page);

    await page.goto("/");
    await expect(page).toHaveTitle("rvt.app");
  });
});
