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

  const loginPage = new LoginPage(page);
  await loginPage.login(testData.loginCredentials.email, testData.loginCredentials.password);

  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
};
