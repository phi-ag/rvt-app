import { bench, describe } from "vitest";

import { processBlob } from "./extract";
import { exampleBlob } from "./extract.test";

describe("process blob", async () => {
  const blob16 = await exampleBlob("rac_basic_sample_family-2016.rfa");
  const blob25 = await exampleBlob("racbasicsamplefamily-2025.rfa");

  bench("basic family 2016", async () => {
    const [info] = await processBlob(blob16);
    if (info.version !== "2016") throw Error(`Unexpected version ${info.version}`);
  });

  bench("basic family 2025", async () => {
    const [info] = await processBlob(blob25);
    if (info.version !== "2025") throw Error(`Unexpected version ${info.version}`);
  });
});
