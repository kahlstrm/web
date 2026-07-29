import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// Imported directly rather than re-exported from astro:content, where it is deprecated.
import { z } from "zod";

/**
 * Blog posts support two layouts that must resolve to the same URL:
 *   src/content/blog/my-post.md        -> /blog/my-post
 *   src/content/blog/my-post/index.md  -> /blog/my-post
 * The loader's default id for the directory form would be "my-post/index", so
 * strip the trailing segment to keep both forms producing a bare slug.
 */
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/(?:\/index)?\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("kahlstrm"),
  }),
});

export const collections = { blog };
