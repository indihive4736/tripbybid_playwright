import { type Page } from "@playwright/test";

export type AgentBookingTypeTab = 'all' | 'flight' | 'train' | 'hotel';

export const ManageBookingsLocators = (page: Page) => ({

    heading: page.getByRole('heading', { level: 1, name: 'Manage bookings' }),
    typeTab: (tab: AgentBookingTypeTab) => page.locator(`#bookings-tab-${tab}`),
    sortButton: page.getByRole('button', { name: /^Sort:/ }),

    // Chip names include counts, e.g. "5 Needs your action"
    statusFilter: (name: RegExp) => page.getByRole('region', { name: 'Filter by status' }).getByRole('button', { name }),
    clearFiltersButton: page.getByRole('button', { name: 'Clear filters' }),

    cards: page.getByRole('main').getByRole('article'),
    // "View details : <route>" or "Upload ticket : <route>", both open the booking
    openBookingLinks: page.getByRole('link', { name: /^(View details|Upload ticket) : / }),

    // Booking detail /agent/manage-bookings/<uuid>
    detailStatus: page.getByText(/^Status:/),
    detailJourneyRegion: page.getByRole('region', { name: 'Booking journey' }),
    detailSectionsNav: page.getByRole('navigation', { name: 'Booking sections' }),
    detailBackLink: page.getByRole('link', { name: 'Manage bookings' }).last(),

})
