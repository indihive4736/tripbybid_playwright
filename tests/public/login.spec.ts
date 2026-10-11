import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AppShellPage } from '../../pages/AppShellPage';
import { AgentShellPage } from '../../pages/AgentShellPage';

// Runs in the public-chromium project, which has no saved session: every test starts logged out

test.describe('Traveller login', () => {

    test('Test case 1: Valid credentials land on the dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto_userLogin();
        await loginPage.login(process.env.TRAVELLER_EMAIL!, process.env.TRAVELLER_PASSWORD!);
        await loginPage.expectLoggedIn();

        const shell = new AppShellPage(page);
        await shell.expectSidebarVisible();
    });

    test('Test case 2: Wrong password shows an error', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto_userLogin();
        await loginPage.login(process.env.TRAVELLER_EMAIL!, 'definitely-wrong-password');
        await loginPage.expectError('Email or password is incorrect');
        await expect(page).toHaveURL(/\/login/);
    });

});

test.describe('Agent login', () => {

    test('Test case 1: Valid credentials land on the agent dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto_agentLogin();
        await loginPage.login(process.env.AGENT_EMAIL!, process.env.AGENT_PASSWORD!);
        await loginPage.expectAgentLoggedIn();

        const shell = new AgentShellPage(page);
        await expect(shell.el.navBrowseRequests).toBeVisible();
    });

    test('Test case 2: Wrong password shows an error', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto_agentLogin();
        await loginPage.login(process.env.AGENT_EMAIL!, 'definitely-wrong-password');
        await loginPage.expectError('Email or password is incorrect');
        await expect(page).toHaveURL(/\/login\/agent/);
    });

    test('Test case 3: Agent pages redirect to agent login when logged out', async ({ page }) => {
        await page.goto('/agent/dashboard');
        await expect(page).toHaveURL(/\/login\/agent\?next=%2Fagent%2Fdashboard/);
    });

});
