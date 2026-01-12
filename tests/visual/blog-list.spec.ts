import { test, expect } from '@playwright/test';

test.describe('Blog List Visual Regression', () => {
  test('blog list - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/blog');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('blog-list-desktop.png', {
      fullPage: true,
    });
  });

  test('blog list - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('blog-list-mobile.png', {
      fullPage: true,
    });
  });
});
