import { type Page, expect } from '@playwright/test';
import { AppShellLocators } from '../locators/AppShellLocators';

/** Sidebar / header actions available on every logged-in page. */
export class AppShellPage {

    readonly page: Page;
    readonly el: ReturnType<typeof AppShellLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = AppShellLocators(page);
    }

    async gotoMyBookings() {
        await this.el.navMyBookings.click();
        await this.page.waitForURL(/\/my-bookings/);
    }

    async gotoNewBooking() {
        await this.el.navNewBooking.click();
        await this.page.waitForURL(/\/create-booking/);
    }

    async gotoDashboard() {
        await this.el.navDashboard.click();
        await this.page.waitForURL(/\/dashboard/);
    }

    async logout() {
        await this.el.logoutButton.click();
        await this.page.waitForURL(/\/login/);
    }

    async expectToast(text: string | RegExp) {
        await expect(this.el.toastRegion).toContainText(text, { timeout: 15_000 });
    }

    async expectSidebarVisible() {
        await expect(this.el.sidebar).toBeVisible();
    }

}
