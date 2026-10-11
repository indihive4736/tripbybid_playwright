import { type Page, expect } from '@playwright/test';
import { BidDrawerLocators } from '../locators/BidDrawerLocators';
import { type BidData } from '../data/bidData';

export const COMMISSION_RATE = 0.04;   // Starter plan
export const BID_PLACED_TOAST = 'Bid placed successfully';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export class BidDrawerPage {

    readonly page: Page;
    readonly el: ReturnType<typeof BidDrawerLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = BidDrawerLocators(page);
    }

    /** Opens the drawer for a request directly by id. */
    async goto_bid(requestId: string) {
        await this.page.goto(`/agent/browse-requests?bid=${requestId}`);
        await expect(this.el.dialog).toBeVisible({ timeout: 15_000 });
    }

    /** Traveller budget shown in the drawer's facts, e.g. "Budget ₹9,000". */
    async readBudget(): Promise<number> {
        const text = await this.el.dialog.innerText();
        const match = text.match(/Budget\s*₹\s*([\d,]+)/);
        expect(match, 'Budget not found in bid drawer').toBeTruthy();
        return Number(match![1].replace(/,/g, ''));
    }

    async fillBid(d: BidData) {
        await this.el.priceInput.fill(String(d.price));
        for (const chip of d.inclusions) {
            await this.el.inclusionChip(chip).click();
            await expect(this.el.inclusionChip(chip)).toHaveAttribute('aria-pressed', 'true');
        }
        if (d.customInclusion) {
            await this.el.customInclusionInput.fill(d.customInclusion);
            await this.el.addInclusionButton.click();
        }
        await this.el.cancellationRadio(d.cancellationPolicy).click();
        if (d.headline) await this.el.headlineInput.fill(d.headline);
        if (d.validity) await this.el.validitySelect.selectOption(d.validity);
        // Option values ("Booking within 24 hours") differ from the labels ("Within 24 hours")
        await this.el.timelineSelect.selectOption({ value: d.timeline });
        if (d.note) await this.el.noteInput.fill(d.note);
    }

    /** Places (or updates) the bid. This writes real data. */
    async submit() {
        await this.el.submitButton.click();
    }

    async expectPlaced() {
        await expect(this.page.getByRole('region', { name: 'Notifications alt+T' }))
            .toContainText(BID_PLACED_TOAST, { timeout: 20_000 });
    }

    /** Live summary: "Your bid ₹X", "Commission (4%) −₹Y", "You earn ₹Z". */
    async expectSummary(price: number, rate = COMMISSION_RATE) {
        const commission = Math.round(price * rate);
        await expect(this.el.summary).toContainText(rupees(price));
        await expect(this.el.summary).toContainText(rupees(commission));
        await expect(this.el.summary).toContainText(rupees(price - commission));
    }

    async expectFieldError(text: string | RegExp) {
        await expect(this.el.fieldError(text).first()).toBeVisible();
    }

    /** Escape closes the drawer and drops ?bid from the URL. Nothing is saved. */
    async close() {
        await this.page.keyboard.press('Escape');
        await expect(this.el.dialog).toBeHidden();
        await expect(this.page).not.toHaveURL(/[?&]bid=/);
    }

}
