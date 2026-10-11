import { test, expect } from '@playwright/test';
import { BrowseRequestsPage } from '../../pages/BrowseRequestsPage';
import { BidDrawerPage } from '../../pages/BidDrawerPage';

test.describe('Agent browse requests', () => {

    test('Test case 1: Trip type filter narrows the list', async ({ page }) => {
        const browse = new BrowseRequestsPage(page);
        await browse.goto_browseRequests();
        const [, total] = await browse.readCount();

        for (const type of ['Flights', 'Trains', 'Hotels'] as const) {
            await browse.filterByType(type);
            const [shown, totalAfter] = await browse.readCount();
            expect(totalAfter).toBe(total);
            expect(shown).toBeLessThanOrEqual(total);
        }

        await browse.filterByType('All');
        const [shownAll] = await browse.readCount();
        expect(shownAll).toBe(total);
    });

    test('Test case 2: Search with no match shows the empty state', async ({ page }) => {
        const browse = new BrowseRequestsPage(page);
        await browse.goto_browseRequests();
        await browse.search('zzz-no-such-city-zzz');
        await browse.expectEmptyState();

        await browse.el.clearFiltersButton.click();
        await expect(browse.el.cards.first()).toBeVisible();
    });

    test('Test case 3: View & bid opens the bid drawer and Escape closes it', async ({ page }) => {
        const browse = new BrowseRequestsPage(page);
        await browse.goto_browseRequests();
        await browse.openFirstWithoutBid();

        const drawer = new BidDrawerPage(page);
        await expect(drawer.el.requestCode).toBeVisible();
        await expect(drawer.el.priceInput).toBeVisible();
        expect(await drawer.readBudget()).toBeGreaterThan(0);
        await drawer.close();
    });

});
