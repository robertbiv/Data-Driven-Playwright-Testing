# Data-Driven Playwright Testing

This repository contains a data-driven Playwright test suite for testing a task management application at `https://animated-gingersnap-8cf7f2.netlify.app/`.

## Overview

The test suite uses data-driven testing to verify task management functionality across multiple projects and task states. Test data is stored in `testData.json` and includes login credentials and test cases for various tasks.

## Test Configuration

- **Base URL**: `https://animated-gingersnap-8cf7f2.netlify.app/`
- **Browser**: Chromium (headless by default)
- **Test Directory**: `./tests`
- **Test Data**: `testData.json`

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Running Tests

### Run all tests (headless)
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
```

### View test report
```bash
npm run report
```

## Test Structure

The test suite includes 6 test cases that verify:
- Login functionality
- Project navigation
- Task verification in correct columns (To Do, In Progress, Done)
- Tag verification for each task

### Test Cases

1. **Test Case 1**: Verify "Implement user authentication" in Web Application
2. **Test Case 2**: Verify "Fix navigation bug" in Web Application
3. **Test Case 3**: Verify "Design system updates" in Web Application
4. **Test Case 4**: Verify "Push notification system" in Mobile Application
5. **Test Case 5**: Verify "Offline mode" in Mobile Application
6. **Test Case 6**: Verify "App icon design" in Mobile Application

## Test Data

Test data is stored in `testData.json` and includes:
- Login credentials (email and password)
- Test cases with:
  - Project name
  - Task name
  - Expected column
  - Expected tags

## Features

- **Data-Driven Testing**: Test cases are defined in JSON format for easy maintenance
- **Screenshot on Failure**: Screenshots are captured when tests fail
- **Video Recording**: Videos are recorded for failed tests
- **Trace Recording**: Playwright traces are saved for failed tests for debugging
- **HTML Report**: Comprehensive test report with screenshots and videos

## Test Output

Test results are saved in:
- `playwright-report/` - HTML test report
- `test-results/` - Screenshots, videos, and traces for failed tests

## Troubleshooting

If tests fail to connect to the application, ensure:
1. The application URL is accessible from your network
2. The application is running and responding
3. Login credentials in `testData.json` are correct
