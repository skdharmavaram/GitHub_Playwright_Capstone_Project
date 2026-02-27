import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage.js';
import {HomePage} from '../pages/HomePage.js';
import {RepoPage} from '../pages/MyRepositoriesPage.js';
import {NewRepoPage} from '../pages/NewRepoCreationPage.js';
import {NewRepoDetails} from '../pages/NewRepoHomePage.js';

import NewFileDetails from '../files/NewFileDetails.json';

import * as updateTestData from '../utils/testData.js';

import dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });
test.describe('GitHub Automation using Playwright ', () => {
    let context;
    let page;
    const url = process.env.GITHUB_URL || "https://github.com/login";
    const userId = process.env.GITHUB_USER;
    const password = process.env.GITHUB_PASSWORD_Invalid;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // Set up the browser context and page before all tests
    // test.beforeAll('TC-00- Setup Browser Context and Page', async ({ browser }) => {
    //     context = await browser.newContext();
    //     // page = await context.newPage();
    // });


    test('Test-01-Verify user is able to log in to GitHub using invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate(url);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveTitle(/Sign in to GitHub/);

        //Sign in with valid credentials
        await loginPage.login(userId, password);

        const currentUrl =await loginPage.getCurrentURL();
        console.log("URL after login:", currentUrl);
        expect(currentUrl).toBe('https://github.com/');
        });
});

// To run the test, use the following command in the terminal:
// npx playwright test tests/GitHubUiAutomation_InvalidLogin.spec.js --headed























// To run the test, use the following command in the terminal:
// npx playwright test tests/GitHubUiAutomationTest.spec.js --headed