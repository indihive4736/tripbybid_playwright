import { type Page, expect } from '@playwright/test';
import { DashboardLocators } from '../locators/DashboardLocators';
import { type RequestType } from './CreateBookingPage';

export class DashboardPage {

    readonly page: Page;
    readonly el: ReturnType<typeof DashboardLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = DashboardLocators(page);
    }

    async goto_dashboard() {
        await this.page.goto('/dashboard');
    }

    /** Dashboard data loads after the shell; wait for the placeholders to disappear. */
    async expectLoaded() {
        await expect(this.el.greeting).toBeVisible();
        await expect(this.el.loadingPlaceholders).toHaveCount(0, { timeout: 15_000 });
    }

    /** Uses the "Start a new request" shortcuts, which deep-link to /create-booking?type=... */
    async startRequest(type: RequestType) {
        const link = {
            flight: this.el.flightRequestLink,
            train: this.el.trainRequestLink,
            hotel: this.el.hotelRequestLink,
        }[type];
        await link.click();
        await this.page.waitForURL(new RegExp(`/create-booking\\?type=${type}`));
    }

}
