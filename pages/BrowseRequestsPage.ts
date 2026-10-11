import { type Page, type Locator, expect } from '@playwright/test';
import { BrowseRequestsLocators, type TripTypeFilter } from '../locators/BrowseRequestsLocators';
import { BidDrawerLocators } from '../locators/BidDrawerLocators';

export class BrowseRequestsPage {

    readonly page: Page;
    readonly el: ReturnType<typeof BrowseRequestsLocators>;
    private readonly drawer: ReturnType<typeof BidDrawerLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = BrowseRequestsLocators(page);
        this.drawer = BidDrawerLocators(page);
    }

    async goto_browseRequests() {
        await this.page.goto('/agent/browse-requests');
        await expect(this.el.heading).toBeVisible({ timeout: 15_000 });
        await expect(this.el.countText).toBeVisible({ timeout: 15_000 });
    }

    async search(text: string) {
        await this.el.search.fill(text);
    }

    async filterByType(name: TripTypeFilter) {
        const radio = this.el.tripTypeRadio(name);
        await radio.click();
        await expect(radio).toBeChecked();
    }

    /** Returns [shown, total] from the "12 of 35 requests" line. */
    async readCount(): Promise<[number, number]> {
        const text = await this.el.countText.innerText();
        const [, shown, total] = text.match(/^(\d+) of (\d+) requests$/)!;
        return [Number(shown), Number(total)];
    }

    /**
     * Finds the card containing `text` (e.g. a unique token in its requirements).
     * Reloads until it shows up, since a just-posted request can take a moment to arrive.
     */
    async findCardWithText(text: string): Promise<Locator> {
        const card = this.el.cardWithText(text).first();
        await expect(async () => {
            await this.goto_browseRequests();
            await this.search(text);
            await expect(card).toBeVisible({ timeout: 5_000 });
        }).toPass({ timeout: 60_000 });
        return card;
    }

    /** Clicks "View & bid" on the card and waits for the drawer. Returns the card's title. */
    async openBidDrawer(card: Locator): Promise<string> {
        const title = (await card.getByRole('heading', { level: 3 }).innerText()).trim();
        await this.el.viewAndBidButton(card).click();
        await expect(this.drawer.dialog).toBeVisible();
        await expect(this.page).toHaveURL(/[?&]bid=[0-9a-f-]{36}/);
        return title;
    }

    async openRequestWithText(text: string): Promise<string> {
        return this.openBidDrawer(await this.findCardWithText(text));
    }

    /** Opens the first request this agent has not bid on yet (read-only use only). */
    async openFirstWithoutBid(): Promise<string> {
        await expect(this.el.viewAndBidButtons.first()).toBeVisible({ timeout: 15_000 });
        // `has` is evaluated inside each card, so the inner locator must be card-relative
        const card = this.el.cards.filter({ has: this.page.getByRole('button', { name: /^View & bid/ }) }).first();
        return this.openBidDrawer(card);
    }

    async expectEmptyState() {
        await expect(this.el.emptyState).toBeVisible();
        await expect(this.el.clearFiltersButton).toBeVisible();
    }

}
