import { type Page } from "@playwright/test";

export const AgentDashboardLocators = (page: Page) => ({

    greeting: page.getByRole('heading', { level: 1, name: /^Welcome back/ }),
    loadingPlaceholders: page.getByText(/^Loading/),
    viewEarningsLink: page.getByRole('main').getByRole('link', { name: 'View earnings' }),
    browseRequestsLink: page.getByRole('main').getByRole('link', { name: 'Browse requests', exact: true }),

    yourNumbersRegion: page.getByRole('region', { name: 'Your numbers' }),
    currentPlanRegion: page.getByRole('region', { name: 'Current plan' }),
    waitingForBidRegion: page.getByRole('region', { name: /Waiting for your bid/ }),
    whereYouStandRegion: page.getByRole('region', { name: /Where you stand/ }),
    needsAttentionRegion: page.getByRole('region', { name: /Needs your attention/ }),

})
