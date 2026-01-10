/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  MODE: string;
  GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
