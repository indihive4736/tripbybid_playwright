import { type Page, expect } from '@playwright/test';
import { BookingDetailLocators } from '../locators/BookingDetailLocators';

export class BookingDetailPage {

    readonly page: Page;
    readonly el: ReturnType<typeof BookingDetailLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = BookingDetailLocators(page);
    }

    async goto_booking(id: string) {
        await this.page.goto(`/my-bookings/${id}`);
    }

    async expectLoaded(title?: string | RegExp) {
        await expect(this.el.requestId).toBeVisible({ timeout: 15_000 });
        await expect(this.el.journeyRegion).toBeVisible();
        if (title) await expect(this.el.heading).toContainText(title);
    }

    async expectStatus(status: string | RegExp) {
        await expect(this.el.status).toContainText(status);
    }

    async goToSection(name: RegExp | string) {
        await this.el.sectionLink(name).click();
    }

}
