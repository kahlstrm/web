import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "always",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
      excludeLangs: ["mermaid"],
    },
    rehypePlugins: [[rehypeMermaid, { strategy: "img-svg" }]],
  },
});
