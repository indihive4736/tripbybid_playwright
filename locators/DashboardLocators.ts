import { type Page } from "@playwright/test";

export const DashboardLocators = (page: Page) => {
    const startNewRequestRegion = page.getByRole('region', { name: 'Start a new request' });

    return {
        greeting: page.getByRole('heading', { level: 1, name: /^Good (morning|afternoon|evening)/ }),
        newRequestLink: page.getByRole('main').getByRole('link', { name: 'New request' }),
        reviewBidsLink: page.getByRole('link', { name: 'Review bids' }),
        loadingPlaceholders: page.getByText(/^Loading your/),

        nextTripRegion: page.getByRole('region', { name: 'Next trip' }),
        yourNumbersRegion: page.getByRole('region', { name: 'Your numbers' }),
        startNewRequestRegion,
        flightRequestLink: startNewRequestRegion.getByRole('link', { name: /^Flight/ }),
        trainRequestLink: startNewRequestRegion.getByRole('link', { name: /^Train/ }),
        hotelRequestLink: startNewRequestRegion.getByRole('link', { name: /^Hotel/ }),
        recentRequestsRegion: page.getByRole('region', { name: 'Recent requests' }),
        viewAllBookingsLink: page.getByRole('link', { name: 'View all bookings' }),
        activityRegion: page.getByRole('region', { name: 'Activity' }),
    };
}
