import { type Page } from "@playwright/test";

export const LoginLocators = (page: Page) => ({

    emailInput: page.getByRole('textbox', { name: 'Email' }),
    passwordInput: page.getByRole('textbox', { name: 'Password' }),
    showPasswordButton: page.getByRole('button', { name: /^(Show|Hide) password$/ }),
    loginButton: page.getByRole('button', { name: 'Log in' }),
    // Scoped to the form: Next.js's route announcer is also a role=alert
    errorMessage: page.locator('form').getByRole('alert'),
    registeredStatus: page.getByRole('status'),
    createAccountLink: page.getByRole('link', { name: 'Create account' }),
    travellerLoginLink: page.getByRole('navigation', { name: 'Account type' }).getByRole('link', { name: /^Traveler/ }),
    agentLoginLink: page.getByRole('navigation', { name: 'Account type' }).getByRole('link', { name: /^Travel agent/ }),

})
