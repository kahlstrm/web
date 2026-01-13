import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeImageLightbox from "./plugins/rehype-image-lightbox.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://kahlstrm.xyz",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "always",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
    rehypePlugins: [rehypeImageLightbox],
  },
});
