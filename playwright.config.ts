import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/** Saved traveller session, written by tests/auth.setup.ts */
export const TRAVELLER_STORAGE_STATE = 'playwright/.auth/user.json';
export const AGENT_STORAGE_STATE = 'playwright/.auth/agent.json';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
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
    baseURL: 'https://www.tripbybid.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    /* Logs in once as the traveller and saves the session for the browser projects */
    {
      name: 'setup-traveller',
      testMatch: /auth\.setup\.ts/,
      grep: /@traveller/,
    },

    {
      name: 'setup-agent',
      testMatch: /auth\.setup\.ts/,
      grep: /@agent/,
    },

    {
      name: 'user-chromium',
      use: { ...devices['Desktop Chrome'], storageState: TRAVELLER_STORAGE_STATE },
      testDir: './tests/user_flow',
      dependencies: ['setup-traveller'],
    },

    {
      name: 'agent-chromium',
      use: { ...devices['Desktop Chrome'], storageState: AGENT_STORAGE_STATE },
      testDir: './tests/agent_flow',
      /* Agent E2E specs also act as the traveller (tests/fixtures.ts), so both sessions are needed */
      dependencies: ['setup-agent', 'setup-traveller'],
    },

    /* Logged-out pages: login forms, redirects, home page */
    {
      name: 'public-chromium',
      use: { ...devices['Desktop Chrome'] },
      testDir: './tests/public',
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: TRAVELLER_STORAGE_STATE },
      testDir: './tests/user_flow',
      dependencies: ['setup-traveller'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: TRAVELLER_STORAGE_STATE },
      testDir: './tests/user_flow',
      dependencies: ['setup-traveller'],
    },

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
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
