import { test, expect } from '@playwright/test';
import { BrowseRequestsPage } from '../../pages/BrowseRequestsPage';
import { BidDrawerPage } from '../../pages/BidDrawerPage';
import { minBidFor } from '../../data/bidData';

/**
 * These tests never complete a valid bid: required fields are always left missing,
 * so client-side validation blocks every submit and nothing is saved.
 */
test.describe('Agent bid form validation', () => {

    let drawer: BidDrawerPage;

    test.beforeEach(async ({ page }) => {
        const browse = new BrowseRequestsPage(page);
        await browse.goto_browseRequests();
        await browse.openFirstWithoutBid();
        drawer = new BidDrawerPage(page);
    });

    test('Test case 1: Empty bid shows required-field errors', async () => {
        await drawer.submit();
        await drawer.expectFieldError('Enter your price to place a bid');
        await drawer.expectFieldError('Choose a cancellation policy');
        await drawer.expectFieldError('Choose when you’ll book');
        await expect(drawer.el.dialog).toBeVisible();
    });

    test('Test case 2: Price below 40% of the budget is rejected', async () => {
        const budget = await drawer.readBudget();
        const tooLow = Math.max(1, Math.floor(minBidFor(budget) / 2));
        await drawer.el.priceInput.fill(String(tooLow));
        await drawer.submit();
        await drawer.expectFieldError(/^Price must be at least ₹[\d,]+ \(40% of the traveler/);
    });

    test('Test case 3: Typing a price updates the commission summary', async () => {
        const budget = await drawer.readBudget();
        const price = Math.round((budget * 0.8) / 50) * 50;
        await drawer.el.priceInput.fill(String(price));
        await drawer.expectSummary(price);
        await drawer.close();
    });

    // Known site bug: the submit button reads "Update bid" on requests the agent never bid on.
    // test.fail() keeps the suite green and will flag "unexpectedly passed" once the site is fixed.
    test('Test case 4: Known bug - submit button should read "Place bid" on a new request', async () => {
        test.fail(true, 'Site shows "Update bid" instead of "Place bid" for new requests');
        await drawer.el.priceInput.fill('5000');
        await expect(drawer.el.submitButton).toHaveText(/^Place bid/, { timeout: 5_000 });
    });

});
