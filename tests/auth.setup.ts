import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TRAVELLER_STORAGE_STATE } from '../playwright.config';
import { AGENT_STORAGE_STATE } from '../playwright.config';

/** Logs in once as the traveller; browser projects reuse the saved session. */
setup('authenticate as traveller', {tag: '@traveller'}, async ({ page }) => {
    const email = process.env.TRAVELLER_EMAIL;
    const password = process.env.TRAVELLER_PASSWORD;
    expect(email, 'TRAVELLER_EMAIL missing from .env').toBeTruthy();
    expect(password, 'TRAVELLER_PASSWORD missing from .env').toBeTruthy();

    const loginPage = new LoginPage(page);
    await loginPage.goto_userLogin();
    await loginPage.login(email!, password!);
    await loginPage.expectLoggedIn();

    await page.context().storageState({ path: TRAVELLER_STORAGE_STATE });
});

/** Logs in once as the agent; browser projects reuse the saved session. */

setup('authenticate as agent' , {tag: '@agent'}  , async({ page }) => {
   const email = process.env.AGENT_EMAIL;
   const password = process.env.AGENT_PASSWORD;
   expect(email, 'AGENT_EMAIL missing from .env').toBeTruthy();
   expect(password, 'AGENT_PASSWORD missing from .env').toBeTruthy();

   const loginPage = new LoginPage(page);
   await loginPage.goto_agentLogin();
   await loginPage.login(email!, password!);
   await loginPage.expectLoggedIn();

   await page.context().storageState({ path: AGENT_STORAGE_STATE });
} )
