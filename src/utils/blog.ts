import type { CollectionEntry } from "astro:content";

/**
 * Filters blog posts based on environment.
 * In production, example posts (slug contains "example") are hidden.
 * In development, all posts are shown.
 */
export function filterBlogPosts(
  posts: CollectionEntry<"blog">[],
  mode: ImportMetaEnv["MODE"] = import.meta.env.MODE,
): CollectionEntry<"blog">[] {
  if (mode === "production") {
    return posts.filter((post) => !post.slug.includes("example"));
  }
  return posts;
}

/**
 * Sorts blog posts by publication date, newest first.
 */
export function sortPostsByDate(
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/**
 * Filters and sorts blog posts.
 * Convenience function combining filterBlogPosts and sortPostsByDate.
 */
export function getFilteredSortedPosts(
  posts: CollectionEntry<"blog">[],
  mode?: ImportMetaEnv["MODE"],
): CollectionEntry<"blog">[] {
  return sortPostsByDate(filterBlogPosts(posts, mode));
}
