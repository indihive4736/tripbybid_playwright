# Playwright Learning

Concise reference for setting up and running Playwright tests.

## Setup

```bash
npm init -y
npm init playwright@latest        # scaffold config, tests, and install browsers
npm install -D @playwright/test   # or add to an existing project
npx playwright install            # download browsers
npx playwright install --with-deps chromium   # browser + OS dependencies (CI/Linux)
```

## Running Tests

```bash
npx playwright test                          # run all tests (headless)
npx playwright test tests/example.spec.ts    # run a single file
npx playwright test -g "login"               # run tests matching a title
npx playwright test --project=chromium       # run a specific browser project
npx playwright test --headed                 # run with visible browser
npx playwright test --workers=1              # run serially
npx playwright test --retries=2              # retry failed tests
npx playwright test --repeat-each=5          # repeat to detect flakiness
npx playwright test --last-failed            # rerun only failures
```

## Debugging

```bash
npx playwright test --debug                  # step through with Playwright Inspector
npx playwright test --ui                     # interactive UI mode
npx playwright test --trace on               # record traces
npx playwright show-trace trace.zip          # open a trace file
PWDEBUG=1 npx playwright test                # Inspector (PowerShell: $env:PWDEBUG=1)
```

## Reports

```bash
npx playwright test --reporter=html          # generate HTML report
npx playwright show-report                   # open the last report
```

## Codegen (Record Tests)

```bash
npx playwright codegen https://example.com
npx playwright codegen --device="iPhone 13" https://example.com
```

## Common Utilities

```bash
npx playwright --version                     # check version
npx playwright test --list                   # list tests without running
npx playwright screenshot https://example.com shot.png
npx playwright pdf https://example.com page.pdf
npx playwright install --list                # show installed browsers
```

## Minimal Test

```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

## Project Layout

```
.
├── tests/                 # test specs
├── playwright.config.ts   # configuration
├── playwright-report/     # HTML report output
└── test-results/          # traces, screenshots, videos
```

## Docs

https://playwright.dev/docs/intro
