
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  /*
   Recommended app changes for robust selectors:
   - Add `data-testid="login-email"` to the email/username input
   - Add `data-testid="login-password"` to the password input
   - Add `data-testid="login-submit"` to the submit button
  */
  async login(email, password) {
    await this.goto();

    // Prefer stable data-testid attributes
    if (await this.page.getByTestId('login-email').count()) {
      await this.page.getByTestId('login-email').fill(email);
    } else if (await this.page.getByRole('textbox', { name: /email|username/i }).count()) {
      await this.page.getByRole('textbox', { name: /email|username/i }).first().fill(email);
    } else if (await this.page.locator('input[type="text"]').count()) {
      await this.page.fill('input[type="text"]', email);
    }

    if (await this.page.getByTestId('login-password').count()) {
      await this.page.getByTestId('login-password').fill(password);
    } else if (await this.page.getByRole('textbox', { name: /password/i }).count()) {
      await this.page.getByRole('textbox', { name: /password/i }).first().fill(password);
    } else if (await this.page.locator('input[type="password"]').count()) {
      await this.page.fill('input[type="password"]', password);
    }

    // Click submit: prefer testid, then role, then generic selector
    if (await this.page.getByTestId('login-submit').count()) {
      await this.page.getByTestId('login-submit').click();
    } else if (await this.page.getByRole('button', { name: /login|sign in|submit/i }).count()) {
      await this.page.getByRole('button', { name: /login|sign in|submit/i }).first().click();
    } else if (await this.page.locator('button[type="submit"]').count()) {
      await this.page.click('button[type="submit"]');
    }

    // Wait for a visible indicator that login succeeded (Projects heading)
    // Some SPAs don't change the URL on navigation; waiting for the URL caused timeouts.
    await this.page.waitForSelector('h1:has-text("Projects")', { timeout: 15000 });
  }
}

module.exports = { LoginPage };
