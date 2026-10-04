import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Blog posts support two layouts that resolve to the same URL:
 *   src/content/blog/my-post.md        -> /blog/my-post
 *   src/content/blog/my-post/index.md  -> /blog/my-post
 * The glob loader's default id collapses the trailing /index, so both forms
 * yield a bare slug. Guarded by the "Blog Post Routes" test.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("kahlstrm"),
  }),
});

export const collections = { blog };
