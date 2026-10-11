import { type Page, type Locator } from "@playwright/test";

export type BidStatusTab = 'active' | 'won' | 'expired' | 'withdrawn';

export const MyBidsLocators = (page: Page) => ({

    heading: page.getByRole('heading', { level: 1, name: 'My bids.' }),
    // Tab names have the count glued on ("Active2"), so use the stable ids
    statusTab: (tab: BidStatusTab) => page.locator(`#my-bids-tab-${tab}`),
    search: page.getByRole('searchbox', { name: 'Search your bids' }),

    cards: page.getByRole('main').getByRole('article'),
    cardWithText: (text: string | RegExp) => page.getByRole('main').getByRole('article').filter({ hasText: text }),
    editBidButton: (card: Locator) => card.getByRole('button', { name: /^Edit bid/ }),
    openBookingLink: (card: Locator) => card.getByRole('link', { name: /^Open booking/ }),

})
