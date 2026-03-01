import { readdir } from "node:fs/promises";
import path from "node:path";

import { test, expect, type Page } from "@playwright/test";

const blogContentDir = path.join(process.cwd(), "src/content/blog");

async function getExpectedBlogSlugs() {
  const entries = await readdir(blogContentDir, { withFileTypes: true });
  const slugs = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        return path.basename(entry.name, ".md");
      }

      if (!entry.isDirectory()) {
        return null;
      }

      const directoryEntries = await readdir(
        path.join(blogContentDir, entry.name),
        {
          withFileTypes: true,
        },
      );
      const hasIndexFile = directoryEntries.some(
        (directoryEntry) =>
          directoryEntry.isFile() && directoryEntry.name === "index.md",
      );

      return hasIndexFile ? entry.name : null;
    }),
  );

  return slugs
    .filter((slug): slug is string => slug !== null)
    .filter((slug) => !slug.includes("example"))
    .sort();
}

async function expectRealBlogPostsOnPage(page: Page) {
  const expectedSlugs = await getExpectedBlogSlugs();
  expect(expectedSlugs.length).toBeGreaterThan(0);

  for (const slug of expectedSlugs) {
    await expect(page.locator(`a[href="/blog/${slug}"]`).first()).toBeVisible();
  }
}

test.describe("Blog List Coverage", () => {
  test("blog list includes real posts - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Blog", exact: true, level: 1 }),
    ).toBeVisible();
    await expectRealBlogPostsOnPage(page);
  });

  test("blog list includes real posts - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Blog", exact: true, level: 1 }),
    ).toBeVisible();
    await expectRealBlogPostsOnPage(page);
  });
});
