import { type Page } from "@playwright/test";

export const throwOnConsoleError = (page: Page) => {
  page.on("console", (message) => {
    if (message.type() === "error") throw message;
    if (message.type() === "warning") console.warn(message);
  });

  page.on("pageerror", (error) => {
    throw error;
  });
};
