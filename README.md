# Data-Driven Playwright Testing

This project runs data-driven Playwright tests against a task management demo app.

## Quick Start

```bash
npm install
npx playwright install
npm test
```

## How It Works

- Test data lives in `testData.json`.
- The spec iterates each test case and verifies tasks in the correct columns and tags.
- Page Objects live under `tests/pages/` and keep selectors centralized.
- A global setup logs in once and stores auth state in `storageState.json`.

## Selector Conventions

For more robust selectors, add `data-testid` attributes in the app:

- Project buttons: `project-<slug>` (example: `project-web-application`)
- Columns: `column-<slug>` (example: `column-to-do`)
- Task cards: `task-<id>`
- Tags: `tag-<slug>` (example: `tag-high-priority`)

## Reports

To open the last HTML report:

```bash
npx playwright show-report
```
