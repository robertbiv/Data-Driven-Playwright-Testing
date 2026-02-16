
const { expect } = require('@playwright/test');

const slugify = (value) => value.replace(/\s+/g, '-').toLowerCase();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class ProjectPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToProject(projectName) {
    // start from project list view
    await this.page.goto('/');
    const projectTestId = `project-${slugify(projectName)}`;
    // locate and click the project
    if (await this.page.getByTestId(projectTestId).count()) {
      const el = this.page.getByTestId(projectTestId).first();
      await el.waitFor({ state: 'visible', timeout: 8000 });
      await el.scrollIntoViewIfNeeded();
      await el.click();
    } else if (await this.page.getByRole('button', { name: projectName }).count()) {
      const el = this.page.getByRole('button', { name: projectName }).first();
      await el.waitFor({ state: 'visible', timeout: 8000 });
      await el.click();
    } else if (await this.page.getByRole('link', { name: projectName }).count()) {
      const el = this.page.getByRole('link', { name: projectName }).first();
      await el.waitFor({ state: 'visible', timeout: 8000 });
      await el.click();
    } else {
      const textLocator = this.page.locator(`text="${projectName}"`);
      await textLocator.first().waitFor({ state: 'visible', timeout: 8000 });
      await textLocator.first().click();
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

    // locate task in the column
    const taskTestId = `task-${slugify(taskName)}`;
    if (await columnLocator.getByTestId(taskTestId).count()) {
      await expect(columnLocator.getByTestId(taskTestId).first()).toBeVisible();
      return;
    }

    const taskHeading = columnLocator.getByRole('heading', { name: taskName });
    if (await taskHeading.count()) {
      await expect(taskHeading.first()).toBeVisible();
      return;
    }

    // handle articles or list items
    if (await columnLocator.getByRole('article', { name: taskName }).count()) {
      await expect(columnLocator.getByRole('article', { name: taskName }).first()).toBeVisible();
      return;
    }

    if (await columnLocator.getByRole('listitem').count()) {
      const candidate = columnLocator.getByRole('listitem').filter({ hasText: taskName }).first();
      if (await candidate.count()) {
        await expect(candidate).toBeVisible();
        return;
      }
    }

    // final fallback: exact text match
    await expect(columnLocator.getByText(taskName, { exact: true }).first()).toBeVisible();
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
      const tagRegex = new RegExp(`^${escapeRegExp(tag)}$`, 'i');

      if (await taskCard.getByTestId(tagTestId).count()) {
        await expect(taskCard.getByTestId(tagTestId).first()).toBeVisible();
        continue;
      }

      if (await taskCard.getByRole('button', { name: tagRegex }).count()) {
        await expect(taskCard.getByRole('button', { name: tagRegex }).first()).toBeVisible();
        continue;
      }

      if (await taskCard.getByText(tag, { exact: true }).count()) {
        await expect(taskCard.getByText(tag, { exact: true }).first()).toBeVisible();
        continue;
      }

      await expect(taskCard.getByText(tag, { timeout: 5000 }).first()).toBeVisible();
    }
  }
}

module.exports = { ProjectPage };
