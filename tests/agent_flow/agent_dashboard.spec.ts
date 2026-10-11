import { test, expect } from '@playwright/test';
import { AgentDashboardPage } from '../../pages/AgentDashboardPage';
import { AgentShellPage, AGENT_SECTIONS, type AgentSection } from '../../pages/AgentShellPage';

test.describe('Agent dashboard', () => {

    test('Test case 1: Dashboard loads with all sections', async ({ page }) => {
        const dashboard = new AgentDashboardPage(page);
        await dashboard.goto_agentDashboard();
        await dashboard.expectLoaded();

        await expect(dashboard.el.yourNumbersRegion).toBeVisible();
        await expect(dashboard.el.currentPlanRegion).toBeVisible();
        await expect(dashboard.el.waitingForBidRegion).toBeVisible();

        const shell = new AgentShellPage(page);
        await expect(shell.el.planBadge).toBeVisible();
        await expect(shell.el.logoutButton).toBeVisible();
    });

    test('Test case 2: Sidebar links open each agent page', async ({ page }) => {
        const dashboard = new AgentDashboardPage(page);
        await dashboard.goto_agentDashboard();
        await dashboard.expectLoaded();

        // Start away from the dashboard (re-clicking the current page blanks it) and finish back on it
        const sections = Object.keys(AGENT_SECTIONS) as AgentSection[];
        const order = [...sections.filter(s => s !== 'dashboard'), 'dashboard' as const];

        const shell = new AgentShellPage(page);
        for (const section of order) {
            await test.step(`open ${section}`, async () => {
                await shell.goto(section);
            });
        }
    });

});
