import {chromium, test} from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
import {LoginPage} from './pages/LoginPage.js';
import {HomePage} from './pages/HomePage.js';


export default async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    const url = process.env.GITHUB_URL || "https://github.com/login";
    const userId = process.env.GITHUB_USER;
    const password = process.env.GITHUB_PASSWORD;



    // Navigate to the GitHub login page
    await loginPage.navigate(url);
    await page.waitForLoadState('domcontentloaded');
    // await expect(page).toHaveTitle(/Sign in to GitHub/);

    //Sign in with valid credentials
    await loginPage.login(userId, password);

    const currentUrl =await loginPage.getCurrentURL();
    console.log("URL after login:", currentUrl);

    await context.storageState({ path: 'auth/auth.json' }); // Save the authentication state to auth.json
};