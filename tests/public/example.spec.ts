import { test, expect } from '@playwright/test';

test('Example 1', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TripByBid/);
});
