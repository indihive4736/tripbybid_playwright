import { type Page } from "@playwright/test";

/** Sidebar, header and toast area shared by every logged-in page. */
export const AppShellLocators = (page: Page) => {
    const sidebar = page.getByRole('complementary', { name: 'Sidebar' });
    const mainNav = sidebar.getByRole('navigation', { name: 'Main' });
    const header = page.getByRole('banner');

    return {
        sidebar,
        mainNav,
        header,
        // Link names carry badges ("My bookings , 2 need your action"), so match the prefix only
        navDashboard: mainNav.getByRole('link', { name: /^Dashboard/ }),
        navNewBooking: mainNav.getByRole('link', { name: /^New booking/ }),
        navPackages: mainNav.getByRole('link', { name: /^Holiday packages/ }),
        navMyBookings: mainNav.getByRole('link', { name: /^My bookings/ }),
        navMessages: mainNav.getByRole('link', { name: /^Messages/ }),
        navNotifications: mainNav.getByRole('link', { name: /^Notifications/ }),
        newRequestLink: sidebar.getByRole('link', { name: 'New request' }),
        settingsLink: sidebar.getByRole('link', { name: 'Settings' }),
        logoutButton: sidebar.getByRole('button', { name: 'Log out' }),

        searchBookings: header.getByRole('searchbox', { name: 'Search bookings' }),
        notificationsBell: header.getByRole('button', { name: /^Notifications/ }),
        accountMenuButton: header.getByRole('button', { name: /^Account menu for/ }),
        signOutMenuItem: page.getByRole('menuitem', { name: 'Sign out' }),

        toastRegion: page.getByRole('region', { name: 'Notifications alt+T' }),
    };
}
