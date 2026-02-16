
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.goto();

    if (await this.page.getByTestId('login-email').count()) {
      await this.page.getByTestId('login-email').fill(email);
    } else if (await this.page.getByLabel(/email|username/i).count()) {
      await this.page.getByLabel(/email|username/i).first().fill(email);
    } else if (await this.page.locator('input[type="text"]').count()) {
      await this.page.fill('input[type="text"]', email);
    }

    if (await this.page.getByTestId('login-password').count()) {
      await this.page.getByTestId('login-password').fill(password);
    } else if (await this.page.getByLabel(/password/i).count()) {
      await this.page.getByLabel(/password/i).first().fill(password);
    } else if (await this.page.locator('input[type="password"]').count()) {
      await this.page.fill('input[type="password"]', password);
    }

    // click submit
    if (await this.page.getByTestId('login-submit').count()) {
      await this.page.getByTestId('login-submit').click();
    } else if (await this.page.getByRole('button', { name: /login|sign in|submit/i }).count()) {
      await this.page.getByRole('button', { name: /login|sign in|submit/i }).first().click();
    } else if (await this.page.locator('button[type="submit"]').count()) {
      await this.page.click('button[type="submit"]');
    }

    // Wait for a post-login indicator
    try {
      await this.page.waitForSelector('h1:has-text("Projects")', { timeout: 8000 });
    } catch (err) {
      // Fallback: wait for a likely post-login URL or a generic projects container
      try {
        await this.page.waitForURL(/projects|dashboard|\/projects\//i, { timeout: 7000 });
      } catch (err2) {
        await this.page.waitForSelector('[data-testid="projects-heading"], h1:has-text("Dashboard"), div:has-text("Projects")', { timeout: 5000 }).catch(() => {});
      }
    }
  }
}

module.exports = { LoginPage };
