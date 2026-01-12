import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Limit the number of workers on CI, use default locally
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html"], ["list"]],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:4321",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start local preview server before tests
  webServer: {
    command: "pnpm preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Visual regression specific settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100, // Allow minor rendering differences
      threshold: 0.2, // Pixel comparison threshold
      animations: "disabled", // Disable animations for consistent screenshots
    },
  },
});
