export class HomePage {
    constructor(page) {
        this.page = page;

        // Locators for HomePage elements
        this.dashboard = page.locator("//span[contains(text(), 'Dashboard')]");
        this.repositories = page.getByRole('link', { name: 'Repositories' });
    }
    // Method to verify click on dashboard
    async dashboardClick() {
        return await this.dashboard.click(); // Click on the dashboard element
    }

    // Method to check if the dashboard is visible
    async isDashboardVisible() {
        return await this.dashboard.isVisible(); // Check if the dashboard element is visible
    }

    // Method to navigate to repositories page
    async navigateToRepositories() {
        await this.repositories.click();
    }

    async getCurrentURL() {
        return this.page.url();
    }
}