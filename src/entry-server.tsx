// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import { v7 as uuidv7 } from "uuid";

import Favicon from "~/images/Phi.svg";
import { SecurityHeader } from "~/lib/security";
import { ThemeHeaderScript } from "~/lib/theme";

export default createHandler(
  () => (
    <StartServer
      document={({ assets, children, scripts }) => (
        <>
          <SecurityHeader />
          <html
            lang="en"
            class="h-full w-full"
            style={{ "color-scheme": "dark" }}
            data-mode="dark"
          >
            <head>
              <meta charset="utf-8" />
              <meta
                name="description"
                content="Display Revit file information in the browser"
              />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" type="image/svg+xml" href={Favicon} />
              <title>rvt.app</title>
              <ThemeHeaderScript />
              {assets}
            </head>
            <body class="flex h-full w-full flex-col bg-slate-200 text-base text-slate-900 antialiased dark:bg-slate-800 dark:text-slate-100">
              <noscript class="mx-2 my-4 flex flex-col items-center gap-2">
                <span class="text-title-lg text-center">
                  This app requires JavaScript ⚡
                </span>
                <span>Please enable it in your browser settings.</span>
              </noscript>
              <div class="flex flex-1 overflow-hidden" id="app">
                {children}
              </div>
              {scripts}
            </body>
          </html>
        </>
      )}
    />
  ),
  () => {
    const nonce = uuidv7();
    return { nonce };
  }
);
