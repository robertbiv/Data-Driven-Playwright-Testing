const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 1,
  reporter: [['html'], ['list']],
  globalSetup: require.resolve('./global-setup'),
  use: {
    baseURL: 'https://animated-gingersnap-8cf7f2.netlify.app/',
    storageState: 'storageState.json',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // Bypass SSL certificate validation for the test environment
    // Note: This is acceptable for testing against Netlify-hosted apps with certificate issues
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        headless: true,
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
      },
    },
  ],
});
