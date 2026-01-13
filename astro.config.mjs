import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import testFixtures from "./test-fixtures-integration.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://kahlstrm.xyz",
  integrations: [sitemap(), testFixtures()],
  build: {
    inlineStylesheets: "always",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
