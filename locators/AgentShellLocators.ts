import { type Page } from "@playwright/test";

/** Sidebar, header and toast area shared by every logged-in agent page. */
export const AgentShellLocators = (page: Page) => {
    const sidebar = page.getByRole('complementary', { name: 'Sidebar' });
    const mainNav = sidebar.getByRole('navigation', { name: 'Main' });
    const header = page.getByRole('banner');

    return {
        sidebar,
        mainNav,
        header,
        // Some link names carry badges ("Messages , 1 unread"), so match the prefix only
        navDashboard: mainNav.getByRole('link', { name: /^Dashboard/ }),
        navBrowseRequests: mainNav.getByRole('link', { name: /^Browse requests/ }),
        navMyBids: mainNav.getByRole('link', { name: /^My bids/ }),
        navPackages: mainNav.getByRole('link', { name: /^Packages/ }),
        navManageBookings: mainNav.getByRole('link', { name: /^Manage bookings/ }),
        navMessages: mainNav.getByRole('link', { name: /^Messages/ }),
        navNotifications: mainNav.getByRole('link', { name: /^Notifications/ }),
        navEarnings: mainNav.getByRole('link', { name: /^Earnings/ }),
        navSubscription: mainNav.getByRole('link', { name: /^Subscription/ }),
        planBadge: sidebar.getByText(/Member · /),
        logoutButton: sidebar.getByRole('button', { name: 'Log out' }),

        searchBookings: header.getByRole('searchbox', { name: 'Search bookings' }),
        notificationsBell: header.getByRole('button', { name: /^Notifications/ }),
        accountMenuButton: header.getByRole('button', { name: /^Account menu for/ }),
        signOutMenuItem: page.getByRole('menuitem', { name: 'Sign out' }),

        toastRegion: page.getByRole('region', { name: 'Notifications alt+T' }),
    };
}
