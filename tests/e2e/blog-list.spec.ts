import { test, expect } from "@playwright/test";
import { getBlogPosts } from "../utils/blog";

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
