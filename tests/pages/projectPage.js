
const { expect } = require('@playwright/test');

const slugify = (value) => value.replace(/\s+/g, '-').toLowerCase();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class ProjectPage {
  constructor(page) {
    this.page = page;
  }

  /*
   Recommended app changes for robust selectors:
   - Add `data-testid="project-<slug>"` to each project button
   - Add `data-testid="column-<slug>"` to each column container
   - Add `data-testid="task-<id>"` to task cards when possible
   - Add `data-testid="tag-<slug>"` to tags
  */
  async navigateToProject(projectName) {
    // Ensure we start from the project list view
    await this.page.goto('/');

    const projectTestId = `project-${slugify(projectName)}`;
    if (await this.page.getByTestId(projectTestId).count()) {
      await this.page.getByTestId(projectTestId).first().click();
    } else if (await this.page.getByRole('button', { name: projectName }).count()) {
      await this.page.getByRole('button', { name: projectName }).first().click();
    } else if (await this.page.getByRole('link', { name: projectName }).count()) {
      await this.page.getByRole('link', { name: projectName }).first().click();
    } else {
      await this.page.click(`text=${projectName}`);
    }
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTaskInColumn(taskName, columnName) {
    const columnTestId = `column-${slugify(columnName)}`;
    let columnLocator;

    if (await this.page.getByTestId(columnTestId).count()) {
      columnLocator = this.page.getByTestId(columnTestId).first();
    } else {
      const columnHeadingRegex = new RegExp(`^${escapeRegExp(columnName)}\\b`, 'i');
      if (await this.page.getByRole('heading', { name: columnHeadingRegex }).count()) {
        const heading = this.page.getByRole('heading', { name: columnHeadingRegex }).first();
        columnLocator = heading.locator('..');
      } else if (await this.page.getByRole('region', { name: columnName }).count()) {
        columnLocator = this.page.getByRole('region', { name: columnName }).first();
      } else {
        columnLocator = this.page.locator(`div:has-text("${columnName}")`).first();
      }
    }

    const taskHeading = columnLocator.getByRole('heading', { name: taskName });
    if (await taskHeading.count()) {
      await expect(taskHeading.first()).toBeVisible();
    } else {
      await expect(columnLocator.getByText(taskName).first()).toBeVisible();
    }
  }

  async verifyTaskTags(taskName, expectedTags) {
    const taskTestId = `task-${slugify(taskName)}`;
    let taskCard;

    if (await this.page.getByTestId(taskTestId).count()) {
      taskCard = this.page.getByTestId(taskTestId).first();
    } else if (await this.page.getByRole('heading', { name: taskName }).count()) {
      const heading = this.page.getByRole('heading', { name: taskName }).first();
      taskCard = heading.locator('..');
    } else {
      taskCard = this.page.locator(`div:has-text("${taskName}")`).first();
    }

    for (const tag of expectedTags) {
      const tagTestId = `tag-${slugify(tag)}`;
      if (await taskCard.getByTestId(tagTestId).count()) {
        await expect(taskCard.getByTestId(tagTestId).first()).toBeVisible();
      } else if (await taskCard.getByText(tag, { exact: true }).count()) {
        await expect(taskCard.getByText(tag, { exact: true }).first()).toBeVisible();
      } else {
        await expect(taskCard.getByText(tag).first()).toBeVisible();
      }
    }
  }
}

module.exports = { ProjectPage };
