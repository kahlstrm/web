import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypePopoverLightbox from "./src/utils/rehype-popover-lightbox.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://kahlstrm.xyz",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "always",
  },
  markdown: {
    rehypePlugins: [rehypePopoverLightbox],
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
