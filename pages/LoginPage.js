export class LoginPage {
    constructor(page) {
        this.page = page;

        //Locators
        this.usernameInput = page.locator('#login_field');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('input[name="commit"]');
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async login(username, password) {
        await this.usernameInput.evaluate((el, username) => {
            el.value = username;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }, username);
        //Wait for 3 seconds
        await this.page.waitForTimeout(3000);
        
        await this.passwordInput.evaluate((el, password) => {
            el.value = password;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }, password);
        await this.loginButton.click();
        // expect(this.page.url()).toBe('https://github.com/');
        // await this.page.waitForLoadState('domcontentloaded');
        // await expect(this.page).toHaveTitle(/Sign in to GitHub/);
    }

    async getCurrentURL() {
        return this.page.url();
    }
}