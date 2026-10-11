import { type Page, expect } from '@playwright/test';
import { LoginLocators } from '../locators/LoginLocators';

export class LoginPage {

    readonly page: Page;
    readonly el: ReturnType<typeof LoginLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = LoginLocators(page);
    }

    async goto_userLogin() {
        await this.page.goto('/login');
    }

    async goto_agentLogin() {
        await this.page.goto('/login/agent');
    }

    async login(email: string, password: string) {
        await this.el.emailInput.fill(email);
        await this.el.passwordInput.fill(password);
        await this.el.loginButton.click();
    }

    /** Travellers land on /dashboard after a successful login. */
    async expectLoggedIn() {
        await this.page.waitForURL(/\/dashboard/);
    }

    /** Agents land on /agent/dashboard after a successful login. */
    async expectAgentLoggedIn() {
        await this.page.waitForURL(/\/agent\/dashboard/);
    }

    async expectError(text: string) {
        await expect(this.el.errorMessage).toContainText(text);
    }

}
