import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
}

/**
 * Parses frontmatter from markdown content.
 * Simple parser that handles the title and description fields.
 */
function parseFrontmatter(content: string): { title: string; description: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error("No frontmatter found");
  }

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m);

  return {
    title: titleMatch?.[1] ?? "",
    description: descriptionMatch?.[1] ?? "",
  };
}

/**
 * Reads all blog posts from the content directory and returns their metadata.
 * Handles both simple (.md) and directory-based (folder/index.md) formats.
 */
function getBlogPosts(): BlogPostMeta[] {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  const posts: BlogPostMeta[] = [];

  for (const entry of entries) {
    let filePath: string;
    let slug: string;

    if (entry.isDirectory()) {
      // Directory format: folder/index.md
      filePath = path.join(blogDir, entry.name, "index.md");
      slug = entry.name;
    } else if (entry.name.endsWith(".md")) {
      // Simple format: post.md
      filePath = path.join(blogDir, entry.name);
      slug = entry.name.replace(/\.md$/, "");
    } else {
      continue;
    }

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const { title, description } = parseFrontmatter(content);

    posts.push({
      slug,
      title,
      description,
    });
  }

  return posts;
}

test.describe("Blog List Page", () => {
  test("displays all blog posts with correct content", async ({ page }) => {
    const expectedPosts = getBlogPosts();

    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    // Get all blog cards on the page
    const blogCards = page.locator(".blog-card");
    const cardCount = await blogCards.count();

    // Verify the correct number of posts are displayed
    expect(cardCount).toBe(expectedPosts.length);

    // Verify each expected post is present with correct content
    for (const post of expectedPosts) {
      const card = page.locator(`.blog-card a[href="/blog/${post.slug}"]`);

      // Card should exist
      await expect(card).toBeVisible();

      // Verify title is displayed
      const title = card.locator("h2");
      await expect(title).toContainText(post.title);

      // Verify description is displayed
      const description = card.locator(".description");
      await expect(description).toHaveText(post.description);
    }
  });

  test("blog post links navigate correctly", async ({ page }) => {
    const expectedPosts = getBlogPosts();

    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    // Test that clicking each blog card navigates to the correct post
    for (const post of expectedPosts) {
      await page.goto("/blog");
      await page.waitForLoadState("networkidle");

      const card = page.locator(`.blog-card a[href="/blog/${post.slug}"]`);
      await card.click();

      // Verify we navigated to the correct URL
      await expect(page).toHaveURL(`/blog/${post.slug}`);

      // Verify the post title is displayed on the post page
      await expect(page.locator("h1")).toContainText(post.title);
    }
  });
});
