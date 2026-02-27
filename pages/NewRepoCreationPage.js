export class NewRepoCreationPage {
    constructor(page) {
        this.page = page;

        // Locators for NewRepoCreationPage elements
        this.newRepositoryButton = page.getByText('New repository');
        this.repositoryNameInput = page.locator('#repository-name-input');
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' }); //page.getByLabel('Description');
        this.visibilityDropdown = page.locator('#visibility-anchor-button');
        this.privateOption = page.getByText('Private');
        this.publicOption = page.getByText('Public');
        this.createRepositoryButton = page.getByRole('button', { name: 'Create repository' });
        
    }

    // Method to navigate to create new repository page
    async navigateToCreateNewRepository() {
        await this.newRepositoryButton.click();
    }


    // Method to fill the fields to create a new repository
    async createNewRepository(repoData) {
        await this.repositoryNameInput.fill(repoData.name);
        await this.descriptionInput.fill(repoData.description);
        // await this.visibilityDropdown.click();
    }

    // Method to select the visibility option as private
    async selectPrivateVisibility() {
        await this.visibilityDropdown.click(); // Open the dropdown
        await this.privateOption.click(); // Select the 'Private' option
    }

    // Method to select the visibility option as public
    async selectPublicVisibility() {
        await this.visibilityDropdown.click(); // Open the dropdown
        await this.publicOption.click(); // Select the 'Public' option
    }

    // Method to click on Create repository button
    async clickCreateRepository() {
        await this.createRepositoryButton.click();
    }
}