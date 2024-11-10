/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly VERSION: string;
  readonly REVISION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
