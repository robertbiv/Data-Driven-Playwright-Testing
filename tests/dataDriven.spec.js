const { test, expect } = require('@playwright/test');
const testData = require('../testData.json');
const { login } = require('./helpers');

// Data-driven test suite preferring `data-testid` selectors with fallbacks
test.describe('Data-Driven Task Verification Tests', () => {
  for (const testCase of testData.testCases) {
    test(`Test Case ${testCase.id}: Verify "${testCase.task}" in ${testCase.project}`, async ({ page }) => {
      // Login using helper (POM)
      await login(page, testData.loginCredentials.email, testData.loginCredentials.password);

      // Navigate to project: prefer testid, then role, then text
      const projectTestId = `project-${testCase.project.replace(/\s+/g, '-').toLowerCase()}`;
      if (await page.getByTestId(projectTestId).count()) {
        await page.getByTestId(projectTestId).click();
      } else if (await page.getByRole('link', { name: testCase.project }).count()) {
        await page.getByRole('link', { name: testCase.project }).first().click();
      } else {
        await page.click(`text=${testCase.project}`);
      }
      await page.waitForLoadState('networkidle');

      // Verify task is in correct column: prefer column testid
      const columnTestId = `column-${testCase.column.replace(/\s+/g, '-').toLowerCase()}`;
      if (await page.getByTestId(columnTestId).count()) {
        const column = page.getByTestId(columnTestId);
        const taskTestId = `task-${testCase.id}`;
        if (await column.getByTestId(taskTestId).count()) {
          await expect(column.getByTestId(taskTestId).first()).toBeVisible();
        } else {
          await expect(column.getByText(testCase.task).first()).toBeVisible();
        }
      } else if (await page.getByRole('region', { name: testCase.column }).count()) {
        const column = page.getByRole('region', { name: testCase.column }).first();
        await expect(column.getByText(testCase.task).first()).toBeVisible();
      } else {
        const columnLocator = page.locator(`div:has-text("${testCase.column}")`).first();
        const taskInColumn = columnLocator.locator(`text=${testCase.task}`);
        await expect(taskInColumn).toBeVisible();
      }

      // Verify tags for the task: prefer task testid then tag testids
      const taskTestId = `task-${testCase.id}`;
      let taskCard;
      if (await page.getByTestId(taskTestId).count()) {
        taskCard = page.getByTestId(taskTestId);
      } else {
        taskCard = page.locator(`div:has-text("${testCase.task}")`).first();
      }

      for (const tag of testCase.tags) {
        const tagTestId = `tag-${tag.replace(/\s+/g, '-').toLowerCase()}`;
        if (await taskCard.getByTestId(tagTestId).count()) {
          await expect(taskCard.getByTestId(tagTestId).first()).toBeVisible();
        } else if (await taskCard.getByText(tag).count()) {
          await expect(taskCard.getByText(tag).first()).toBeVisible();
        } else {
          const tagLocator = taskCard.locator(`text=${tag}`);
          await expect(tagLocator).toBeVisible();
        }
      }
    });
  }
});
