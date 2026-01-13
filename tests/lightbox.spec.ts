import { test, expect } from "@playwright/test";

test.describe("Image Lightbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/example-lightbox-test");
    await page.waitForLoadState("networkidle");
  });

  test("images have lightbox trigger links", async ({ page }) => {
    const triggers = page.locator(".image-trigger");
    await expect(triggers).toHaveCount(2);

    // Each trigger should contain an image
    for (const trigger of await triggers.all()) {
      await expect(trigger.locator("img")).toBeVisible();
    }
  });

  test("lightbox elements exist but are hidden", async ({ page }) => {
    const lightboxes = page.locator(".lightbox");
    await expect(lightboxes).toHaveCount(2);

    // Lightboxes should not be visible initially
    for (const lightbox of await lightboxes.all()) {
      await expect(lightbox).not.toBeVisible();
    }
  });

  test("clicking image opens lightbox", async ({ page }) => {
    const firstTrigger = page.locator(".image-trigger").first();
    const firstLightbox = page.locator(".lightbox").first();

    // Click the first image
    await firstTrigger.click();

    // Lightbox should now be visible
    await expect(firstLightbox).toBeVisible();

    // URL should have hash
    expect(page.url()).toContain("#lightbox-");
  });

  test("clicking lightbox overlay closes it", async ({ page }) => {
    const firstTrigger = page.locator(".image-trigger").first();
    const firstLightbox = page.locator(".lightbox").first();

    // Open lightbox
    await firstTrigger.click();
    await expect(firstLightbox).toBeVisible();

    // Click the close link (covers entire viewport)
    await page.locator(".lightbox-close").first().click();

    // Lightbox should be hidden
    await expect(firstLightbox).not.toBeVisible();
  });

  test("each image opens its own lightbox", async ({ page }) => {
    const triggers = page.locator(".image-trigger");
    const lightboxes = page.locator(".lightbox");

    // Click first image
    await triggers.nth(0).click();
    await expect(lightboxes.nth(0)).toBeVisible();
    await expect(lightboxes.nth(1)).not.toBeVisible();

    // Close it
    await page.locator(".lightbox-close").first().click();

    // Click second image
    await triggers.nth(1).click();
    await expect(lightboxes.nth(0)).not.toBeVisible();
    await expect(lightboxes.nth(1)).toBeVisible();
  });

  test("lightbox image has correct src", async ({ page }) => {
    const firstTrigger = page.locator(".image-trigger").first();
    const triggerImg = firstTrigger.locator("img");
    const lightboxImg = page.locator(".lightbox").first().locator("img");

    // Get the src from trigger image
    const triggerSrc = await triggerImg.getAttribute("src");

    // Open lightbox
    await firstTrigger.click();

    // Lightbox image should have same src
    const lightboxSrc = await lightboxImg.getAttribute("src");
    expect(lightboxSrc).toBe(triggerSrc);
  });

  test("lightbox has zoom-out cursor", async ({ page }) => {
    const firstTrigger = page.locator(".image-trigger").first();
    await firstTrigger.click();

    const closeLink = page.locator(".lightbox-close").first();
    await expect(closeLink).toHaveCSS("cursor", "zoom-out");
  });

  test("trigger has zoom-in cursor", async ({ page }) => {
    const firstTrigger = page.locator(".image-trigger").first();
    await expect(firstTrigger).toHaveCSS("cursor", "zoom-in");
  });
});
