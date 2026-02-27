import {test, expect} from '@playwright/test'; 
import {LoginPage} from '../pages/LoginPage';
import {HomePage} from '../pages/HomePage';
import { MyRepositoriesPage } from '../pages/MyRepositoriesPage';
import { NewRepoCreationPage } from '../pages/NewRepoCreationPage';
import {NewRepoHomePage} from '../pages/NewRepoHomePage';
import NewFileDetails from '../files/NewFileDetails.json';
import * as updateTestData from '../utils/testData.js';

import dotenv from 'dotenv';
dotenv.config();
test.describe.configure({mode: 'serial'});
test.describe('GitHub UI Tests', () => {
    let context;
    let page;
    const url = process.env.GITHUB_URL || 'https://github.com';
    const username = process.env.GITHUB_USER;
    const password = process.env.GITHUB_PASSWORD;

    test.beforeAll(async ({browser}) => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('TC01: Verify user can login successfully', async () => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate(url);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveTitle(/Sign in to GitHub/);
        
        // sign in to GitHub with valid credentials
        await loginPage.login(username, password);

        const currentUrl =await loginPage.getCurrentURL();
        console.log("URL after login:", currentUrl);
    });

    test('TC02: Verify user can navigate to repositories page', async () => {
        const homePage = new HomePage(page);
        // // Verify that the user is on able to see dashboard after login
        // const isDashboardVisible = await homePage.isDashboardVisible();
        // expect(isDashboardVisible).toBeTruthy();
        // Click on the dashboard element
        await homePage.dashboardClick();
        await expect(page).toHaveURL('https://github.com/');
        console.log("Dashboard clicked successfully");
        const homepageUrl = await page.url();
        console.log("URL after clicking dashboard:", homepageUrl);
        // Navigate to the Repositories page
        await homePage.navigateToRepositories();
        await expect(page).toHaveURL('https://github.com/repos');
        const RepositoriesUrl = await page.url();
        console.log("URL after navigating to Repositories page:", RepositoriesUrl);
    });
    test('TC-03 - Verify that the user can navigate to the My Repositories from repositories page', async () => {
        const myRepositoriesPage = new MyRepositoriesPage(page);
        // Open the My Repositories section
        await myRepositoriesPage.navigateToMyRepositories();
        const currentUrl1 = await page.url();
        await expect(page).toHaveURL('https://github.com/repos');
        console.log("URL after navigating to My Repositories section:", currentUrl1); 
        // Here I checked about the URL test. Hence I created same methods in two pages and I am using those methods to get the URL and print in the console for cross verification.
        // // Navigate to create new repository page
        // await myRepositoriesPage.navigateToCreateNewRepository();
        // await page.waitForLoadState('domcontentloaded');
        // await expect(page).toHaveURL('https://github.com/new');
        // const newRepoCreationPageUrl = await page.url();
        // console.log("2.URL after navigating to new repository creation page:", newRepoCreationPageUrl);
    });

    test('TC-04 - Verify that the user is able to create new repository', async () => {
        const newRepoCreationPage = new NewRepoCreationPage(page);
        // Navigate to create new repository page
        await newRepoCreationPage.navigateToCreateNewRepository();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL('https://github.com/new');
        const newRepoCreationPageUrl = await page.url();
        console.log("2.URL after navigating to new repository creation page:", newRepoCreationPageUrl);
        const repoData = updateTestData.createRepoPayload();
        // Fill the fields to create a new repository
        await newRepoCreationPage.createNewRepository(repoData);
        // Select the visibility option as private
        await newRepoCreationPage.selectPrivateVisibility();
        await page.waitForTimeout(2000);
        //Select the visibility option as public
        await newRepoCreationPage.selectPublicVisibility();
        await page.waitForTimeout(2000);
        // Click on Create repository button
        await newRepoCreationPage.clickCreateRepository();
        await page.waitForTimeout(2000);
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const newRepoUrl = await page.url();
        console.log("URL after creating new repository:", newRepoUrl);
        await expect(page).toHaveURL(newRepoUrl);
        expect(newRepoUrl).toBe(`https://github.com/${username}/${repoData.name}`)
        
    });

    test.skip('TC-05 - Verify that the user is able to create a new file in new repository', async () => {
        const newRepoHomePage = new NewRepoHomePage(page);

        //Select the option to create a new file
        await newRepoHomePage.selectNewFileCreation();
        await page.waitForLoadState('domcontentloaded');
        const filecreationUrl = await page.url();
        console.log("URL after clicking on create new file option:", filecreationUrl);
        await expect(page).toHaveURL(filecreationUrl);

        // Fill the file name and content for the new file
        await newRepoHomePage.fillFileDetails(NewFileDetails.fileName, NewFileDetails.description);

        // Click on Commit changes button
        await newRepoHomePage.clickCommitChanges();
        // await page.waitForLoadState('domcontentloaded');
        // which is opened a dialog box where in that I need to click on commit changes button again to commit the changes.
        await page.once('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });
        // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const afterCommitUrl = await page.url();
        console.log("URL after committing changes:", afterCommitUrl);
        // await expect(page).toHaveURL(afterCommitUrl);        
        
    });
});

// to run this specific file in headed mode: npx playwright test tests/GitHubUiTest.spec.js --headed