const { test, expect } = require('./test-fixtures');
const testData = require('../testData.json');

// Data-driven test suite using fixtures for POM instances
test.describe('Data-Driven Task Verification Tests', () => {
  for (const testCase of testData.testCases) {
    test(`Test Case ${testCase.id}: Verify "${testCase.task}" in ${testCase.project}`, async ({ projectPage }) => {
      await test.step('Open project', async () => {
        await projectPage.navigateToProject(testCase.project);
      });

      await test.step('Verify task column', async () => {
        await projectPage.verifyTaskInColumn(testCase.task, testCase.column);
      });

      await test.step('Verify task tags', async () => {
        await projectPage.verifyTaskTags(testCase.task, testCase.tags);
      });
    });
  }
});
