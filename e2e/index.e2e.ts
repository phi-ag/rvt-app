import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { throwOnConsoleError } from "./utils.js";

test.describe("e2e", () => {
  test("title", async ({ page }) => {
    throwOnConsoleError(page);

    await page.goto("/");
    await expect(page).toHaveTitle("rvt.app");
  });

  test("dropzone", async ({ page }) => {
    throwOnConsoleError(page);

    await page.goto("/");
    page.on("filechooser", async (fileChooser) => {
      await fileChooser.setFiles(
        join(import.meta.dirname, "files/racbasicsamplefamily-2025.rfa")
      );
    });

    const dropzone = page.getByTestId("dropzone");
    await expect(dropzone).toHaveText(/Drag 'n' drop/);

    await dropzone.click();

    await expect(page.getByTestId("name")).toHaveText("racbasicsamplefamily-2025.rfa");
    await expect(page.getByTestId("version")).toHaveText("2025");
    await expect(page.getByTestId("build")).toHaveText("Development Build");
    await expect(page.getByTestId("identityId")).toHaveText(
      "00000000-0000-0000-0000-000000000000"
    );
    await expect(page.getByTestId("documentId")).toHaveText(
      "192933d0-a868-4367-b6b5-ae53e4e948c4"
    );
    await expect(page.getByTestId("path")).toHaveText(
      "C:\\Users\\hansonje\\Desktop\\Downloadable Files\\racbasicsamplefamily.rfa"
    );
    await expect(page.getByTestId("content")).not.toBeEmpty();
  });
});
