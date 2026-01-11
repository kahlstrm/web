import type { CollectionEntry } from "astro:content";

/**
 * Filters blog posts based on environment.
 * In production (VERCEL_ENV=production), example posts are hidden.
 * In preview/development, all posts are shown.
 */
export function filterBlogPosts(
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  // Only filter out examples on production deployments
  const isProduction = process.env.VERCEL_ENV === "production";
  if (isProduction) {
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
): CollectionEntry<"blog">[] {
  return sortPostsByDate(filterBlogPosts(posts));
}
