import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage.js';
import {HomePage} from '../pages/HomePage.js';
import {RepoPage} from '../pages/RepoPage.js';
import {NewRepoPage} from '../pages/NewRepo.js';
import {NewRepoDetails} from '../pages/NewRepoDetails.js';

import NewFileDetails from '../files/NewFileDetails.json';

import * as updateTestData from '../utils/testData.js';

import dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });
test.describe('GitHub Automation using Playwright ', () => {
    // let repoName;
    test('Test-02-Verify the dashboard visibility', async ({ page }) => {
        const homePage = new HomePage(page);
        // Check if the dashboard is visible after login
        const isDashboardVisible = await homePage.isDashboardVisible();
        console.log("Is the dashboard visible?", isDashboardVisible);
        expect(isDashboardVisible).toBeTruthy();
    });

    test('Test-03-Verify that user is able to navigate to repositories page', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigateToRepositories();
        const repositoriesUrl = await homePage.getCurrentURL();
        console.log("URL after navigating to repositories:", repositoriesUrl);
        expect(repositoriesUrl).toBe('https://github.com/repos');
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: `screenshots/repositories_page_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
    });

    test('Test-04-Verify that user is able to navigate to My repositories page', async ({ page }) => {
        // const repositoryName = `playwright-repo-${Date.now()}`;
        const repoPage = new RepoPage(page);

        // Navigate to My repositories page
        await repoPage.navigateToMyRepositories();
        const myRepositoriesUrl = await page.url();
        console.log("URL after navigating to My repositories:", myRepositoriesUrl);
        expect(myRepositoriesUrl).toBe('https://github.com/repos');
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: `screenshots/my_repositories_page_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
    });
    test('Test-05-Verify that user is able to identify the mentioned repository in My repositories page', async ({ page }) => {
        const repoPage = new RepoPage(page);
        // Check if the specific repository is visible in My repositories page
        const isRepoVisible = await repoPage.isMyRepoVisible();
        console.log("Is the specified repository visible?", isRepoVisible);
        expect(isRepoVisible).toBeTruthy();
        await page.waitForLoadState('domcontentloaded');
    });

    test('Test-06-Verify that user is able to navigate to create new repository page', async ({ page }) => {
        const repoPage = new RepoPage(page);
        // Navigate to create new repository page
        await repoPage.navigateToCreateNewRepository();
        const newRepoUrl = await page.url();
        console.log("URL after navigating to create new repository:", newRepoUrl);
        expect(newRepoUrl).toBe('https://github.com/new');
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: `screenshots/create_new_repository_page_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
    });

    test('Test-07- Verify that user is able to fill the details to create a new repository', async ({ page }) => {
        const newRepoPage = new NewRepoPage(page);
        const repoData = updateTestData.createRepoPayload();

        // Create a new repository
        await newRepoPage.createNewRepository(repoData);
        await page.waitForTimeout(2000);
        await newRepoPage.selectPrivateVisibility();
        await page.waitForTimeout(2000);
        await newRepoPage.selectPublicVisibility();
        await page.screenshot({ path: `screenshots/new_repository_details_entered_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);

        // Click on Create repository button to create the new repository
        await newRepoPage.clickCreateRepository();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const createdRepoUrl = await page.url();
        console.log("URL after creating new repository:", createdRepoUrl);
        await page.screenshot({ path: `screenshots/repository_created_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
        expect(createdRepoUrl).toBe(`https://github.com/${userId}/${repoData.name}`);


    });
    test('Test-08-Verify that user is able to click on create new file hyperlink', async ({ page }) => {
        const newRepoDetails = new NewRepoDetails(page);

        // Select the option to create README file
        await newRepoDetails.selectNewFileCreation();
        await page.waitForLoadState('domcontentloaded');
        const readmeUrl = await page.url();
        console.log("URL after selecting file creation:", readmeUrl);
        await page.screenshot({ path: `screenshots/file_creation_page_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
    });

    test('Test-9-Verify that user is able to fill the details for the new file and commit changes', async ({ page }) => {
        const newRepoDetails = new NewRepoDetails(page);
        const fileData = NewFileDetails;
        
        // Fill the file name and content for the new file
        await newRepoDetails.fillFileDetails(fileData.fileName, fileData.description);
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `screenshots/new_file_details_entered_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
        
        // Click on Commit changes button to create the new file
        await newRepoDetails.clickCommitChanges();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const repoUrl = await page.url();
        console.log("URL after committing new file:", repoUrl);
        expect(repoUrl).toContain(`/${fileData.fileName}`); //expect(repoUrl).toContain(`/${userId}/${repoData.name}`);
        await page.screenshot({ path: `screenshots/file_created_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);

    });

});


























// To run the test, use the following command in the terminal:
// npx playwright test tests/GitHubUiAutomationTest_2.spec.js --headed