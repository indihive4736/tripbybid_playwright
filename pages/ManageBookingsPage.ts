import { type Page, expect } from '@playwright/test';
import { ManageBookingsLocators, type AgentBookingTypeTab } from '../locators/ManageBookingsLocators';

export const AGENT_BOOKING_DETAIL_URL = /\/agent\/manage-bookings\/[0-9a-f-]{36}/;

export class ManageBookingsPage {

    readonly page: Page;
    readonly el: ReturnType<typeof ManageBookingsLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = ManageBookingsLocators(page);
    }

    async goto_manageBookings() {
        await this.page.goto('/agent/manage-bookings');
        await expect(this.el.heading).toBeVisible({ timeout: 15_000 });
    }

    async selectTypeTab(tab: AgentBookingTypeTab) {
        await this.el.typeTab(tab).click();
        await expect(this.el.typeTab(tab)).toHaveAttribute('aria-selected', 'true');
    }

    /** Chip names include a count, e.g. /Needs your action/ */
    async filterByStatus(name: RegExp) {
        await this.el.statusFilter(name).click();
        await expect(this.el.clearFiltersButton).toBeVisible();
    }

    async openFirstBooking() {
        await this.el.openBookingLinks.first().click();
        await this.page.waitForURL(AGENT_BOOKING_DETAIL_URL);
    }

    async expectDetailLoaded() {
        await expect(this.el.detailStatus).toBeVisible({ timeout: 15_000 });
        await expect(this.el.detailJourneyRegion).toBeVisible();
        await expect(this.el.detailSectionsNav).toBeVisible();
    }

}
