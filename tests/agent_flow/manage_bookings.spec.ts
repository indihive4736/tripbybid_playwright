import { test, expect } from '@playwright/test';
import { ManageBookingsPage } from '../../pages/ManageBookingsPage';

/** Read-only: no ticket uploads, cancellations or messages. */
test.describe('Agent manage bookings', () => {

    test('Test case 1: Switch booking type tabs', async ({ page }) => {
        const bookings = new ManageBookingsPage(page);
        await bookings.goto_manageBookings();
        for (const tab of ['flight', 'train', 'hotel', 'all'] as const) {
            await bookings.selectTypeTab(tab);
        }
        await expect(bookings.el.cards.first()).toBeVisible();
    });

    test('Test case 2: Filter by status updates the URL', async ({ page }) => {
        const bookings = new ManageBookingsPage(page);
        await bookings.goto_manageBookings();
        await bookings.filterByStatus(/Needs your action/);
        await expect(page).toHaveURL(/status=needs_action/);
        await bookings.el.clearFiltersButton.click();
        await expect(bookings.el.clearFiltersButton).toBeHidden();
    });

    test('Test case 3: Open a booking and see its detail page', async ({ page }) => {
        const bookings = new ManageBookingsPage(page);
        await bookings.goto_manageBookings();
        await bookings.openFirstBooking();
        await bookings.expectDetailLoaded();
    });

});
