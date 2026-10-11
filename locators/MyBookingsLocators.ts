import { type Page } from "@playwright/test";

export type BookingTypeTab = 'All' | 'Flights' | 'Trains' | 'Hotels';

export const MyBookingsLocators = (page: Page) => ({

    heading: page.getByRole('heading', { level: 1, name: 'My bookings' }),
    newRequestLink: page.getByRole('main').getByRole('link', { name: 'New request' }),

    typeTabList: page.getByRole('tablist', { name: 'Booking type' }),
    typeTab: (name: BookingTypeTab) => page.getByRole('tablist', { name: 'Booking type' }).getByRole('tab', { name }),
    sortButton: page.getByRole('button', { name: /^Sort:/ }),

    // Filter names include counts, e.g. "2 Needs your action"
    statusFilterRegion: page.getByRole('region', { name: 'Filter by status' }),
    statusFilter: (name: RegExp) => page.getByRole('region', { name: 'Filter by status' }).getByRole('button', { name }),
    clearFiltersButton: page.getByRole('button', { name: 'Clear filters' }),

    cards: page.getByRole('article'),
    bookingCard: (title: string) => page.getByRole('article', { name: title }),
    viewDetailsLink: (title: string) => page.getByRole('link', { name: `View details : ${title}` }),
    viewDetailsLinks: page.getByRole('link', { name: /^View details : / }),

})
