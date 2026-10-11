import { type Page } from "@playwright/test";

/** The slide-over bid drawer opened from Browse requests / My bids (`?bid=<requestId>`). */
export const BidDrawerLocators = (page: Page) => {
    const priceInput = page.getByLabel('Your price · all-inclusive');
    // The drawer is a dialog named after the route; pin it by the price field it contains
    const dialog = page.getByRole('dialog').filter({ has: priceInput });
    const summary = dialog.locator('dl').last();

    return {
        dialog,
        requestCode: dialog.getByText(/^R-[A-Z0-9]+ · /),
        title: dialog.getByRole('heading', { level: 2 }).first(),
        closeButton: dialog.getByRole('button', { name: 'Close' }),

        priceInput,
        quickPriceButtons: dialog.getByRole('list', { name: 'Quick prices' }).getByRole('button'),
        inclusionChip: (name: string) => dialog.getByRole('group', { name: /What’s included/ }).getByRole('button', { name, exact: true }),
        customInclusionInput: dialog.getByLabel('Add something else your price includes'),
        addInclusionButton: dialog.getByRole('button', { name: 'Add', exact: true }),
        cancellationRadio: (name: string) => dialog.getByRole('radiogroup', { name: 'Cancellation policy' }).getByRole('radio', { name, exact: true }),
        headlineInput: dialog.getByLabel('Headline (optional)'),
        validitySelect: dialog.getByLabel('Offer valid for'),
        // Curly apostrophe, as rendered by the site
        timelineSelect: dialog.getByLabel('You’ll book'),
        noteInput: dialog.getByLabel('Note to traveler'),

        summary,
        yourBidValue: summary.locator('dt:has-text("Your bid") + dd'),
        commissionValue: summary.locator('dt:has-text("Commission") + dd'),
        youEarnValue: summary.locator('dt:has-text("You earn") + dd'),

        // Label reads "Update bid" even for new requests (site bug), so locate by type
        submitButton: dialog.locator('button[type=submit]'),
        fieldError: (text: string | RegExp) => dialog.getByText(text),
    };
}
