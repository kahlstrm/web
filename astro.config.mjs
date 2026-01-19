import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { imageLinks } from "./src/plugins/image-links";

// https://astro.build/config
export default defineConfig({
  site: "https://kahlstrm.xyz",
  integrations: [sitemap(), imageLinks()],
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
