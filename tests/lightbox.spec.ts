import { test, expect } from "@playwright/test";

test.describe("Image Links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/example-lightbox-test");
    await page.waitForLoadState("networkidle");
  });

  test("images are wrapped in links", async ({ page }) => {
    const imageLinks = page.locator(".image-link");
    await expect(imageLinks).toHaveCount(2);

    // Each link should contain an image
    for (const link of await imageLinks.all()) {
      await expect(link.locator("img")).toBeVisible();
    }
  });

  test("image links open in new tab", async ({ page }) => {
    const firstLink = page.locator(".image-link").first();
    await expect(firstLink).toHaveAttribute("target", "_blank");
    await expect(firstLink).toHaveAttribute("rel", "noopener");
  });

  test("image links point to image source", async ({ page }) => {
    const firstLink = page.locator(".image-link").first();
    const img = firstLink.locator("img");

    const imgSrc = await img.getAttribute("src");
    const linkHref = await firstLink.getAttribute("href");

    expect(linkHref).toBe(imgSrc);
  });

  test("links have zoom-in cursor", async ({ page }) => {
    const firstLink = page.locator(".image-link").first();
    await expect(firstLink).toHaveCSS("cursor", "zoom-in");
  });

  test("images already in links are not double-wrapped", async ({ page }) => {
    // Navigate to a page and check structure
    const links = page.locator(".image-link");
    for (const link of await links.all()) {
      // Each image-link should directly contain an img, not another link
      const directChildren = link.locator("> *");
      const imgs = link.locator("> img");
      await expect(imgs).toHaveCount(1);
    }
  });
});
