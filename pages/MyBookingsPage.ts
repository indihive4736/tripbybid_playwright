import { type Page, expect } from '@playwright/test';
import { MyBookingsLocators, type BookingTypeTab } from '../locators/MyBookingsLocators';

export const BOOKING_DETAIL_URL = /\/my-bookings\/[0-9a-f-]{36}/;

export class MyBookingsPage {

    readonly page: Page;
    readonly el: ReturnType<typeof MyBookingsLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = MyBookingsLocators(page);
    }

    async goto_myBookings() {
        await this.page.goto('/my-bookings');
        await expect(this.el.heading).toBeVisible();
    }

    async selectTypeTab(name: BookingTypeTab) {
        const tab = this.el.typeTab(name);
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
    }

    /** Status filter names include a count, e.g. /Needs your action/ */
    async filterByStatus(name: RegExp) {
        await this.el.statusFilter(name).click();
        await expect(this.el.clearFiltersButton).toBeVisible();
    }

    async clearFilters() {
        await this.el.clearFiltersButton.click();
    }

    async openBooking(title: string) {
        await this.el.viewDetailsLink(title).first().click();
        await this.page.waitForURL(BOOKING_DETAIL_URL);
    }

    async openFirstBooking() {
        await this.el.viewDetailsLinks.first().click();
        await this.page.waitForURL(BOOKING_DETAIL_URL);
    }

    async expectCardVisible(title: string) {
        await expect(this.el.bookingCard(title).first()).toBeVisible({ timeout: 15_000 });
    }

    /** For cards whose exact title is not known up front (e.g. station names). */
    async expectCardMatching(text: RegExp) {
        await expect(this.el.cards.filter({ hasText: text }).first()).toBeVisible({ timeout: 15_000 });
    }

    async expectUrlStatus(status: string) {
        await expect(this.page).toHaveURL(new RegExp(`status=${status}`));
    }

}
