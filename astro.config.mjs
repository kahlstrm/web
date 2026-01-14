import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { rehypeImageLinks } from "./src/plugins/rehype-image-links";
import { fixImageLinks } from "./src/plugins/fix-image-links";

// https://astro.build/config
export default defineConfig({
  site: "https://kahlstrm.xyz",
  integrations: [sitemap(), fixImageLinks()],
  build: {
    inlineStylesheets: "always",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
    rehypePlugins: [rehypeImageLinks],
  },
});
