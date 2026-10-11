import { type Page, type Locator } from "@playwright/test";

export type TripTypeFilter = 'All' | 'Flights' | 'Hotels' | 'Trains';

export const BrowseRequestsLocators = (page: Page) => {
    // exact: the stats region "Open requests at a glance" would also match
    const openRequestsRegion = page.getByRole('region', { name: 'Open requests', exact: true });

    return {
        heading: page.getByRole('heading', { level: 1, name: 'Browse requests.' }),
        statsRegion: page.getByRole('region', { name: 'Open requests at a glance' }),
        openRequestsRegion,

        search: page.getByRole('searchbox', { name: 'Search requests' }),
        tripTypeRadio: (name: TripTypeFilter) => page.getByRole('radiogroup', { name: 'Trip type' }).getByRole('radio', { name, exact: true }),
        // exact: the "Sort by" select has an option "Highest budget"
        budgetSelect: page.getByRole('combobox', { name: 'Budget', exact: true }),
        sortSelect: page.getByRole('combobox', { name: 'Sort by' }),
        countText: page.getByText(/^\d+ of \d+ requests$/),

        cards: openRequestsRegion.getByRole('article'),
        cardWithText: (text: string | RegExp) => openRequestsRegion.getByRole('article').filter({ hasText: text }),
        // "View & bid , <title>" for new requests; "Your bid ₹X · Edit , <title>" once bid on
        viewAndBidButton: (card: Locator) => card.getByRole('button', { name: /^View & bid/ }),
        viewAndBidButtons: openRequestsRegion.getByRole('button', { name: /^View & bid/ }),
        yourBidButton: (card: Locator) => card.getByRole('button', { name: /^Your bid/ }),

        emptyState: page.getByText('No requests match'),
        clearFiltersButton: page.getByRole('button', { name: 'Clear filters' }),
    };
}
