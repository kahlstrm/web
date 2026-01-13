import * as fs from "fs";
import * as path from "path";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
}

/**
 * Reads blog posts from the generated test fixtures.
 * Requires running `pnpm build:offline` first to generate the fixtures.
 */
export function getBlogPosts(): BlogPostMeta[] {
  const fixturesPath = path.join(process.cwd(), "tests/fixtures/posts.json");

  if (!fs.existsSync(fixturesPath)) {
    throw new Error(
      "Test fixtures not found. Run `pnpm build:offline` to generate them.",
    );
  }

  const content = fs.readFileSync(fixturesPath, "utf-8");
  return JSON.parse(content);
}
