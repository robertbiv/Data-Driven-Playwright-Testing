# Data-Driven Playwright Testing

Lightweight Playwright test suite for a task-management demo app. Tests are data-driven using `testData.json` and organized with page objects under `tests/pages/`.

## Badges

[![Playwright Tests](https://github.com/robertbiv/Data-Driven-Playwright-Testing/actions/workflows/playwright.yml/badge.svg)](https://github.com/robertbiv/Data-Driven-Playwright-Testing/actions/workflows/playwright.yml)

## Prerequisites

- Node.js 16+ and npm
- Git (optional)

## Install

Install dependencies and Playwright browsers:

```bash
npm install
npx playwright install --with-deps
```

## Run Tests

- Run the full test suite (headless):

```bash
npm test
```

- Run headed tests:

```bash
npm run test:headed
```

- Open the HTML report after a run:

```bash
npm run report
```

## Project Structure

- `tests/` — test specs, helpers, fixtures, and page objects
- `testData.json` — external test cases used by the spec
- `playwright.config.js` — Playwright configuration
- `global-setup.js` — optional global setup (login, auth state)

## How the Suite Works

- Data-driven: the spec reads `testData.json` and runs a scenario per entry.
- Page objects (in `tests/pages/`) centralize selectors and actions.
- Auth state can be cached to speed up runs (see `global-setup.js`).

## Adding Tests

1. Add or update a case in `testData.json`.
2. Add/modify a test in `tests/` that consumes the new data.
3. Reuse or extend page objects under `tests/pages/`.

## Selector Recommendations

Prefer stable attributes such as `data-testid` for selectors:

- `data-testid="project-<slug>"` for project links
- `data-testid="column-<slug>"` for columns
- `data-testid="task-<id>"` for task cards
