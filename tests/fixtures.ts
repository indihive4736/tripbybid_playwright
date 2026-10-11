import { test as base, type Page } from '@playwright/test';
import { TRAVELLER_STORAGE_STATE } from '../playwright.config';

/**
 * Adds a `travellerPage` fixture: a second, independent browser context logged in as the
 * traveller. Agent specs use it to create the request they then bid on, in the same test.
 */
export const test = base.extend<{ travellerPage: Page }>({
    travellerPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: TRAVELLER_STORAGE_STATE });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

export { expect } from '@playwright/test';
