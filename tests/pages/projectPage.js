
const { expect } = require('@playwright/test');

class ProjectPage {
  constructor(page) {
    this.page = page;
  }

  /*
   Recommended app changes for robust selectors:
   - Add `data-testid="project-<slug>"` to each project link (e.g., `project-web-application`)
   - Add `data-testid="column-<slug>"` to each column (e.g., `column-to-do`)
   - Add `data-testid="task-<id>"` to task cards when possible
   - Add `data-testid="tag-<slug>"` to tags
  */
  async navigateToProject(projectName) {
    // Prefer role or testid selectors
    if (await this.page.getByRole('link', { name: projectName }).count()) {
      await this.page.getByRole('link', { name: projectName }).first().click();
    } else if (await this.page.getByTestId(`project-${projectName.replace(/\s+/g,'-').toLowerCase()}`).count()) {
      await this.page.getByTestId(`project-${projectName.replace(/\s+/g,'-').toLowerCase()}`).click();
    } else {
      // Fallback: text click
      await this.page.click(`text=${projectName}`);
    }
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTaskInColumn(taskName, columnName) {
    const columnTestId = `column-${columnName.replace(/\s+/g,'-').toLowerCase()}`;

    let columnLocator;
    if (await this.page.getByTestId(columnTestId).count()) {
      columnLocator = this.page.getByTestId(columnTestId);
    } else if (await this.page.getByRole('region', { name: columnName }).count()) {
      columnLocator = this.page.getByRole('region', { name: columnName }).first();
    } else {
      columnLocator = this.page.locator(`div:has-text("${columnName}")`).first();
    }

    const taskInColumn = columnLocator.locator(`text=${taskName}`);
    await expect(taskInColumn).toBeVisible();
  }

  async verifyTaskTags(taskName, expectedTags) {
    // Prefer task-specific testid if present; else find a card by visible text
    let taskCard;
    // Try to find by testid using a slugified taskName
    const taskTestId = `task-${taskName.replace(/\s+/g,'-').toLowerCase()}`;
    if (await this.page.getByTestId(taskTestId).count()) {
      taskCard = this.page.getByTestId(taskTestId);
    } else {
      taskCard = this.page.locator(`div:has-text("${taskName}")`).first();
    }

    for (const tag of expectedTags) {
      const tagTestId = `tag-${tag.replace(/\s+/g,'-').toLowerCase()}`;
      if (await taskCard.getByTestId(tagTestId).count()) {
        await expect(taskCard.getByTestId(tagTestId)).toBeVisible();
      } else if (await taskCard.getByText(tag).count()) {
        await expect(taskCard.getByText(tag)).toBeVisible();
      } else {
        // Fallback: search globally for tag text inside the task card locator
        const tagLocator = taskCard.locator(`text=${tag}`);
        await expect(tagLocator).toBeVisible();
      }
    }
  }
}

module.exports = { ProjectPage };
