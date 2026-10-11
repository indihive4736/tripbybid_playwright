import { test, expect } from '@playwright/test';
import { MyBookingsPage } from '../../pages/MyBookingsPage';
import { BookingDetailPage } from '../../pages/BookingDetailPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('My bookings', () => {

    test('Test case 1: Dashboard loads and links to My bookings', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        await dashboard.goto_dashboard();
        await dashboard.expectLoaded();
        await expect(dashboard.el.startNewRequestRegion).toBeVisible();
        await dashboard.el.viewAllBookingsLink.click();
        await expect(page).toHaveURL(/\/my-bookings/);
    });

    test('Test case 2: Switch booking type tabs', async ({ page }) => {
        const myBookings = new MyBookingsPage(page);
        await myBookings.goto_myBookings();
        for (const tab of ['Flights', 'Trains', 'Hotels', 'All'] as const) {
            await myBookings.selectTypeTab(tab);
        }
        await expect(myBookings.el.cards.first()).toBeVisible();
    });

    test('Test case 3: Filter by status updates the URL', async ({ page }) => {
        const myBookings = new MyBookingsPage(page);
        await myBookings.goto_myBookings();
        await myBookings.filterByStatus(/Needs your action/);
        await myBookings.expectUrlStatus('needs_action');
        await myBookings.clearFilters();
        await expect(myBookings.el.clearFiltersButton).toBeHidden();
    });

    test('Test case 4: Open a booking and see its detail page', async ({ page }) => {
        const myBookings = new MyBookingsPage(page);
        await myBookings.goto_myBookings();
        await myBookings.openFirstBooking();

        const detail = new BookingDetailPage(page);
        await detail.expectLoaded();
        await expect(detail.el.sectionsNav).toBeVisible();
        await expect(detail.el.status).toBeVisible();
    });

});
