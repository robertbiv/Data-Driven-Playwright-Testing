// Load local `.env` for developer runs; CI supplies secrets instead.
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional in CI; ignore if unavailable
}

// Warn developers if running locally without an `.env` file.
// Do not warn in CI (GitHub Actions sets `GITHUB_ACTIONS=true`).
try {
  const fs = require('fs');
  const inCI = Boolean(process.env.GITHUB_ACTIONS);
  if (!inCI && !fs.existsSync('.env')) {
    /* eslint-disable no-console */
    console.warn('Warning: .env not found. Copy .env.example to .env and set TEST_EMAIL/TEST_PASSWORD for local runs.');
    /* eslint-enable no-console */
  }
} catch (e) {
  // ignore
}

const { chromium } = require('@playwright/test');
const testData = require('./testData.json');
const { LoginPage } = require('./tests/pages/loginPage');

module.exports = async (config) => {
  const browser = await chromium.launch();
  const baseURL = (config.projects && config.projects[0] && config.projects[0].use && config.projects[0].use.baseURL)
    || (config.use && config.use.baseURL);

  if (!baseURL) {
    throw new Error('baseURL is required for global setup login');
  }

  const page = await browser.newPage({ baseURL });

  // Prefer environment variables (set via CI secrets) and fall back to testData.json if present
  const email = process.env.TEST_EMAIL || (testData.loginCredentials && testData.loginCredentials.email);
  const password = process.env.TEST_PASSWORD || (testData.loginCredentials && testData.loginCredentials.password);

  if (!email || !password) {
    await browser.close();
    throw new Error('Login credentials are required. Set TEST_EMAIL and TEST_PASSWORD environment variables or populate testData.json.loginCredentials');
  }

  const loginPage = new LoginPage(page);
  await loginPage.login(email, password);

  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
};
