import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { type JSXElement, Suspense } from "solid-js";

import { ThemeProvider } from "~/lib/theme";

import "./app.css";

export default function (): JSXElement {
  return (
    <ThemeProvider>
      <Router root={(props) => <Suspense>{props.children}</Suspense>}>
        <FileRoutes />
      </Router>
    </ThemeProvider>
  );
}
