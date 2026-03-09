import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 *  See Akilesh Rao at 8:45 for a brief overview of the config file:
 * https://www.youtube.com/watch?v=NvOMwD5Buik&list=PL62km_yqC3ZGHc3qO_CGlvV8bPzt1VZ12&index=5
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000', // Todo: Generate this dynamically from .env

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Gotcha:
    //
    // Webkit (Safari) is notorious for being flaky or failing on some dev machines,
    // especially on macOS with certain hardware or Playwright versions.
    // The error you see (Bus error: 10) is a low-level crash, often related to Playwright’s
    // bundled Webkit binary and your system's libraries.
    //
    // Do Other People Run Into This?
    // Tons of devs hit this, especially on Mac, M1/M2/M3 chips, or with certain Playwright versions.
    // It's a known issue in the Playwright community:
    //
    //   - https://github.com/microsoft/playwright/issues/1935
    //   - https://ray.run/discord-forum/threads/36429-playwright-tests-failing-on-webkit
    //
    // Sometimes, a fresh install or clearing Playwright’s browser cache helps, but with Apple Silicon,
    // it’s often just a compatibility thing that only the Playwright team can fix in a future release.
    // Sometimes teams skip Webkit locally and only run it in CI, where the environment is more predictable.
    //
    // This currently won't work. It's more of a Webkit issue than a Playwright issue.
    //
    ///////////////////////////////////////////////////////////////////////////
    // ❌ { name: 'webkit', use: { ...devices['Desktop Safari'] } }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
