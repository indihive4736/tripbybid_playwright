import { type Page } from "@playwright/test";

export const BookingDetailLocators = (page: Page) => ({

    backLink: page.getByRole('link', { name: 'My bookings' }),
    requestId: page.getByText(/^Request #/),
    status: page.getByText(/^Status:/),
    heading: page.getByRole('heading', { level: 1 }),

    journeyRegion: page.getByRole('region', { name: 'Booking journey' }),
    journeyStep: page.getByText(/^Step \d of 7/),

    sectionsNav: page.getByRole('navigation', { name: 'Booking sections' }),
    sectionLink: (name: RegExp | string) => page.getByRole('navigation', { name: 'Booking sections' }).getByRole('link', { name }),

    availableBidsRegion: page.getByRole('region', { name: 'Available bids' }),
    noBidsText: page.getByText('No bids yet'),
    acceptedBidRegion: page.getByRole('region', { name: 'Your accepted bid' }),
    payNowLink: page.getByRole('link', { name: /^Pay now : / }),

})
