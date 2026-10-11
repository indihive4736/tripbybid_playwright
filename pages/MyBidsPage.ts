import { type Page, expect } from '@playwright/test';
import { MyBidsLocators, type BidStatusTab } from '../locators/MyBidsLocators';

export class MyBidsPage {

    readonly page: Page;
    readonly el: ReturnType<typeof MyBidsLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = MyBidsLocators(page);
    }

    async goto_myBids() {
        await this.page.goto('/agent/my-bids');
        await expect(this.el.heading).toBeVisible({ timeout: 15_000 });
    }

    async selectTab(tab: BidStatusTab) {
        await this.el.statusTab(tab).click();
        await expect(this.el.statusTab(tab)).toHaveAttribute('aria-selected', 'true');
    }

    /** An Active-tab card with this title and price, with its "Edit bid" action. */
    async expectActiveBid(title: string, price: number) {
        await this.selectTab('active');
        const card = this.el.cardWithText(title).filter({ hasText: `₹${price.toLocaleString('en-IN')}` }).first();
        await expect(card).toBeVisible({ timeout: 15_000 });
        await expect(this.el.editBidButton(card)).toBeVisible();
    }

}
