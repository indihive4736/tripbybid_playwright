import { type Page, expect } from '@playwright/test';
import { AgentDashboardLocators } from '../locators/AgentDashboardLocators';

export class AgentDashboardPage {

    readonly page: Page;
    readonly el: ReturnType<typeof AgentDashboardLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = AgentDashboardLocators(page);
    }

    async goto_agentDashboard() {
        await this.page.goto('/agent/dashboard');
    }

    /** Sections load after the shell; wait for every "Loading…" placeholder to go. */
    async expectLoaded() {
        await expect(this.el.greeting).toBeVisible({ timeout: 15_000 });
        await expect(this.el.loadingPlaceholders).toHaveCount(0, { timeout: 20_000 });
    }

}
