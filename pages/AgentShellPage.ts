import { type Page, type Locator, expect } from '@playwright/test';
import { AgentShellLocators } from '../locators/AgentShellLocators';

export type AgentSection =
    | 'dashboard' | 'browseRequests' | 'myBids' | 'packages' | 'manageBookings'
    | 'earnings' | 'subscription';

/** Where each sidebar link should land, and the h1 it should show. */
export const AGENT_SECTIONS: Record<AgentSection, { url: RegExp; heading: RegExp }> = {
    dashboard: { url: /\/agent\/dashboard/, heading: /^Welcome back/ },
    browseRequests: { url: /\/agent\/browse-requests/, heading: /^Browse requests\.$/ },
    myBids: { url: /\/agent\/my-bids/, heading: /^My bids\.$/ },
    packages: { url: /\/agent\/packages/, heading: /^Holiday packages$/ },
    manageBookings: { url: /\/agent\/manage-bookings/, heading: /^Manage bookings$/ },
    earnings: { url: /\/agent\/earnings/, heading: /^Your earnings\.$/ },
    subscription: { url: /\/agent\/pricing/, heading: /^Pay less on every booking\.$/ },
};

export class AgentShellPage {

    readonly page: Page;
    readonly el: ReturnType<typeof AgentShellLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = AgentShellLocators(page);
    }

    private navLink(section: AgentSection): Locator {
        return {
            dashboard: this.el.navDashboard,
            browseRequests: this.el.navBrowseRequests,
            myBids: this.el.navMyBids,
            packages: this.el.navPackages,
            manageBookings: this.el.navManageBookings,
            earnings: this.el.navEarnings,
            subscription: this.el.navSubscription,
        }[section];
    }

    /** Clicks the sidebar link and waits for the section's URL and heading. */
    async goto(section: AgentSection) {
        const { url, heading } = AGENT_SECTIONS[section];
        await this.navLink(section).click();
        await this.page.waitForURL(url);
        await expect(this.page.getByRole('heading', { level: 1, name: heading })).toBeVisible({ timeout: 15_000 });
    }

    async logout() {
        await this.el.logoutButton.click();
        await this.page.waitForURL(/\/login/);
    }

    async expectToast(text: string | RegExp) {
        await expect(this.el.toastRegion).toContainText(text, { timeout: 15_000 });
    }

}
