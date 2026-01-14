import { test, expect } from '@playwright/test';

test.describe('Blog Posts Visual Regression', () => {
  test.describe('Example Post', () => {
    test('example post - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/blog/example-post');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take full page screenshot
      await expect(page).toHaveScreenshot('example-post-desktop.png', {
        fullPage: true,
      });
    });

    test('example post - mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/blog/example-post');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take full page screenshot
      await expect(page).toHaveScreenshot('example-post-mobile.png', {
        fullPage: true,
      });
    });
  });

  // TODO: Update baselines after image-link feature is merged
  // Skipped because wrapping images in links changes layout slightly
  test.describe.skip('Example Post with Assets', () => {
    test('example with assets - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/blog/example-with-assets');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Additional wait to ensure image is loaded
      await page.waitForTimeout(500);

      // Take full page screenshot
      await expect(page).toHaveScreenshot('example-with-assets-desktop.png', {
        fullPage: true,
      });
    });

    test('example with assets - mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/blog/example-with-assets');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Additional wait to ensure image is loaded
      await page.waitForTimeout(500);

      // Take full page screenshot
      await expect(page).toHaveScreenshot('example-with-assets-mobile.png', {
        fullPage: true,
      });
    });
  });
});
