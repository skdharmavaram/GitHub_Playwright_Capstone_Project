import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage.js';
import {HomePage} from '../pages/HomePage.js';
import {MyRepositoriesPage} from '../pages/MyRepositoriesPage.js';
import {NewRepoCreationPage} from '../pages/NewRepoCreationPage.js';
import {NewRepoHomePage} from '../pages/NewRepoHomePage.js';

import NewFileDetails from '../files/NewFileDetails.json';

import * as updateTestData from '../utils/testData.js';

import dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });
test.describe('GitHub Web UI Automation Using Playwright', () => {
    let context;
    let page;
    const url = process.env.GITHUB_URL || "https://github.com/login";
    const userId = process.env.GITHUB_USER;
    const password = process.env.GITHUB_PASSWORD;
    // const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // Set up the browser context and page before all tests
    test.beforeAll('TC‑00 – Verify that the browser context and page are set up properly', async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    test.afterAll('Verify that the browser Context is closed properly', async () => {
        await context.close();
    });

    test('TC-01 - Verify that the user is able to log in successfully', async () => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate(url);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveTitle(/Sign in to GitHub/);

        //Sign in with valid credentials
        await loginPage.login(userId, password);

        const currentUrl =await loginPage.getCurrentURL();
        console.log("URL after login:", currentUrl);


        const isLoggedIn = currentUrl === 'https://github.com/';
        const isDeviceVerification = currentUrl.includes('/sessions/verified-device');

        expect(isLoggedIn || isDeviceVerification).toBeTruthy();

        // If device verification is required, handle it
        if (isDeviceVerification) {
            console.log("Device verification is required. Please complete the verification process manually.");
            // Wait for the user to complete device verification
            await page.waitForNavigation({ waitUntil: 'networkidle' });
            const postVerificationUrl = await loginPage.getCurrentURL();
            console.log("URL after device verification:", postVerificationUrl);
            expect(postVerificationUrl).toBe('https://github.com/');
        }   else {
            console.log("Logged in successfully without device verification.");
        }
        await page.screenshot({ path: `screenshots/login_success_${Date.now()}.png`, fullPage: true });   
    });

    test('TC-02 - Verify that the user can see the dashboard after login', async () => {
        const homePage = new HomePage(page);
        // Check if the dashboard is visible after login
        const isDashboardVisible = await homePage.isDashboardVisible();
        console.log("Is the dashboard visible?", isDashboardVisible);
        expect(isDashboardVisible).toBeTruthy();
    });

    test('TC-03 - Verify that the user can navigate to the Repositories page', async () => {
        const homePage = new HomePage(page);
        await homePage.navigateToRepositories();
        const repositoriesUrl = await homePage.getCurrentURL();
        expect(repositoriesUrl).toBe('https://github.com/repos');
        console.log("URL after navigating to repositories:", repositoriesUrl);
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: `screenshots/repositories_page_${Date.now()}.png`, fullPage: true }); 
    });

    test('TC-04 - Verify that the user can open the My Repositories section', async () => {
        const repositoryName = `playwright-repo-${Date.now()}`;
        const repoPage = new MyRepositoriesPage(page);

        // Navigate to My repositories page
        await repoPage.navigateToMyRepositories();
        // soft wait for 2 seconds to allow the page to load completely and display my repositories
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const myRepositoriesUrl = await page.url();
        expect(myRepositoriesUrl).toContain('https://github.com/repos');
        console.log("URL after navigating to My repositories:", myRepositoriesUrl);
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: `screenshots/my_repositories_page_${Date.now()}.png`, fullPage: true });
    });
    test('TC-05 - Verify that the user can find the specified repository in the list', async () => {
        const repoPage = new MyRepositoriesPage(page);
        // Check if the specific repository is visible in My repositories page
        const isRepoVisible = await repoPage.isMyRepoVisible();
        console.log("Is the specified repository visible?", isRepoVisible);
        expect(isRepoVisible).toBeTruthy();
        await page.waitForLoadState('domcontentloaded');
    });

    test('TC-06 - Verify that the user can navigate to the Create New Repository page', async () => {
        const repoPage = new MyRepositoriesPage(page);
        // Navigate to create new repository page
        await repoPage.navigateToCreateNewRepository();
        const newRepoUrl = await page.url();
        await expect(page).toHaveURL('https://github.com/new');
        console.log("URL after navigating to create new repository:", newRepoUrl);
        await page.waitForLoadState('domcontentloaded');        
        await page.screenshot({ path: `screenshots/create_new_repository_page_${Date.now()}.png`, fullPage: true });
    });

    test('TC-07 - Verify that the user can enter details to create a new repository', async () => {
        const newRepoPage = new NewRepoCreationPage(page);
        const repoData = updateTestData.createRepoPayload();

        // Create a new repository
        await newRepoPage.createNewRepository(repoData);
        await newRepoPage.selectPrivateVisibility();
        await newRepoPage.selectPublicVisibility();
        await page.screenshot({ path: `screenshots/new_repository_details_entered_${Date.now()}.png`, fullPage: true });

        // Click on Create repository button to create the new repository
        await newRepoPage.clickCreateRepository();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const createdRepoUrl = await page.url();
        console.log("URL after creating new repository:", createdRepoUrl);
        await page.screenshot({ path: `screenshots/repository_created_${Date.now()}.png`, fullPage: true });
        expect(createdRepoUrl).toBe(`https://github.com/${userId}/${repoData.name}`);


    });
    test('TC-08 - Verify that the user can navigate to the Create New File page', async () => {
        const newRepoDetails = new NewRepoHomePage(page);

        // Select the option to create README file
        await newRepoDetails.selectNewFileCreation();
        await page.waitForLoadState('domcontentloaded');
        const readmeUrl = await page.url();
        console.log("URL after selecting file creation:", readmeUrl);
        await page.screenshot({ path: `screenshots/file_creation_page_${Date.now()}.png`, fullPage: true });
    });

    test.skip('TC-09 - Verify that the user can add file details and commit the new file', async () => {
        const newRepoDetails = new NewRepoHomePage(page);
        const fileData = NewFileDetails;
        
        // Fill the file name and content for the new file
        await newRepoDetails.fillFileDetails(fileData.fileName, fileData.description);
        await page.screenshot({ path: `screenshots/new_file_details_entered_${Date.now()}.png`, fullPage: true });
        
        // Click on Commit changes button to create the new file
        await newRepoDetails.clickCommitChanges();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const repoUrl = await page.url();
        expect(repoUrl).toContain(`/${fileData.fileName}`); //expect(repoUrl).toContain(`/${userId}/${repoData.name}`);
        console.log("URL after committing new file:", repoUrl);
        await page.screenshot({ path: `screenshots/file_created_${Date.now()}.png`, fullPage: true });
    });

});


























// To run the test, use the following command in the terminal:
// npx playwright test tests/GitHubUiAutomationTestCopy_3.spec.js --headed  