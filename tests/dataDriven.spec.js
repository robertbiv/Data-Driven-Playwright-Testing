const { test, expect } = require('@playwright/test');
const testData = require('../testData.json');

// Helper function to perform login
async function login(page, email, password) {
  await page.goto('/');
  await page.fill('input[type="text"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/projects');
}

// Helper function to navigate to a project
async function navigateToProject(page, projectName) {
  await page.click(`text=${projectName}`);
  await page.waitForLoadState('networkidle');
}

// Helper function to verify task is in a specific column
async function verifyTaskInColumn(page, taskName, columnName) {
  // Locate the column container - using .first() as a defensive approach
  // Note: In production, this should use data-testid or unique class selectors
  const columnLocator = page.locator(`div:has-text("${columnName}")`).first();
  const taskInColumn = columnLocator.locator(`text=${taskName}`);
  await expect(taskInColumn).toBeVisible();
}

// Helper function to verify tags for a task
async function verifyTaskTags(page, taskName, expectedTags) {
  // Find the task card - using .first() as a defensive approach
  // Note: In production, this should use data-testid or unique class selectors
  const taskCard = page.locator(`div:has-text("${taskName}")`).first();
  
  // Verify each tag is present within the task card
  for (const tag of expectedTags) {
    const tagLocator = taskCard.locator(`text=${tag}`);
    await expect(tagLocator).toBeVisible();
  }
}

// Data-driven test suite
test.describe('Data-Driven Task Verification Tests', () => {
  // Run a test for each test case in the JSON data
  for (const testCase of testData.testCases) {
    test(`Test Case ${testCase.id}: Verify "${testCase.task}" in ${testCase.project}`, async ({ page }) => {
      // Step 1: Login to the application
      await login(page, testData.loginCredentials.email, testData.loginCredentials.password);
      
      // Step 2: Navigate to the specific project
      await navigateToProject(page, testCase.project);
      
      // Step 3: Verify the task is in the correct column
      await verifyTaskInColumn(page, testCase.task, testCase.column);
      
      // Step 4: Verify the task has the correct tags
      await verifyTaskTags(page, testCase.task, testCase.tags);
    });
  }
});
