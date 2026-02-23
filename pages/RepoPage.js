export class RepoPage {
    constructor(page) {
        this.page = page;

        // Locators for RepoPage elements
        this.myRepositories = page.getByRole('link', { name: 'My repositories' });
        this.myRepoName = page.locator('//*[text()="Playwright_Project_20260127"]');
        this.newRepositoryButton = page.getByText('New repository');
    }

    // Method to navigate to My repositories page
    async navigateToMyRepositories() {
        await this.myRepositories.click();
    }
    // Method to check if a specific repository is visible
    async isMyRepoVisible() {
        return await this.myRepoName.isVisible();
    }

    // Method to navigate to create new repository page
    async navigateToCreateNewRepository() {
        await this.newRepositoryButton.click();
    }
}
