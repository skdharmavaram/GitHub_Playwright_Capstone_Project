export class NewRepoDetails {
    constructor(page) {
        this.page = page;

        // Locators for NewRepoDetails elements
        this.createAnewFile = page.getByRole('link', { name: 'creating a new file' });
        this.fileNameInput = page.locator('//*[@aria-label="File name"]');
        this.readmeTextArea = page.getByRole('textbox');
        this.commitChanges = page.getByRole('button', { name: 'Commit changes...' });
    }

    // Method to select the option to create a new file
    async selectNewFileCreation() {
        await this.createAnewFile.click();
    }

    // Method to fill the file name and content for the new file
    async fillFileDetails(fileName, description) {
        await this.fileNameInput.fill(fileName);
        await this.readmeTextArea.fill(description);
    }

    // Method to click on Commit changes button
    async clickCommitChanges() {
        await this.commitChanges.click(); // Click the button
        // await this.page.waitForSelector('text=README.md', { timeout: 30000 }); // Wait for the README file to appear
    }
}
