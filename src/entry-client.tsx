// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";

import("~/lib/hello.js").then((m) => m.default());

mount(() => <StartClient />, document.getElementById("app")!);
