const base = require('@playwright/test');
const { LoginPage } = require('./pages/loginPage');
const { ProjectPage } = require('./pages/projectPage');

const test = base.test.extend({
  // Provides a ready-to-use LoginPage instance
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await use(lp);
  },

  // Provides a ready-to-use ProjectPage instance
  projectPage: async ({ page }, use) => {
    const pp = new ProjectPage(page);
    await use(pp);
  },
});

module.exports = { test, expect: base.expect };
