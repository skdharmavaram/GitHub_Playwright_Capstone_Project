import {test, expect} from '@playwright/test';
import {createRepo, deleteRepo} from '../api/repo.api';
import {LoginPage} from '../pages/LoginPage';
import {HomePage} from '../pages/HomePage';
import { MyRepositoriesPage } from '../pages/MyRepositoriesPage';
import dotenv from 'dotenv';
dotenv.config();

test('Create a repository via API and verify in UI', async ({page}) => {
    const token = process.env.GITHUB_TOKEN;
    const repoName = `playwright-Api-To-Ui-test-${Date.now()}`;
    const url = process.env.GITHUB_URL || 'https://github.com';
    const username = process.env.GITHUB_USER;
    const password = process.env.GITHUB_PASSWORD;

    try
    {
    //Create a repository via API
    const repoResponse = await createRepo(token, repoName);
    expect(repoResponse.name).toBe(repoName);

    //Navigate to GitHub UI
    const loginPage = new LoginPage(page);
    await loginPage.navigate(url);
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle(/Sign in to GitHub/);
        
    // sign in to GitHub with valid credentials
    await loginPage.login(username, password);

    const currentUrl =await loginPage.getCurrentURL();
    console.log("URL after login:", currentUrl);

    // Navigate to repo
    await page.goto(repoResponse.html_url);

    // Validate repo in UI
    await expect(page.locator('strong[itemprop="name"]')).toHaveText(repoName);
    } finally {
        // Clean up - delete the repository via API
        await deleteRepo(token, username, repoName);
    }

    const checkResponse = await page.context().request.get(`https://api.github.com/repos/${username}/${repoName}`);
    expect(checkResponse.status()).toBe(404);
    console.log("Verified repository deletion via API with status code:", checkResponse.status());
});


// to run this specific file, use the command: npx playwright test tests/GitHubAPIUI_e2e_Integration.spec.js