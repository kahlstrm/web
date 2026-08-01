import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
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
    // Astro 7 defaults to Sätteri; opt back into remark/rehype for the lightbox plugin.
    processor: unified({ rehypePlugins: [rehypePopoverLightbox] }),
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
