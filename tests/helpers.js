const { LoginPage } = require('./pages/loginPage');
const { ProjectPage } = require('./pages/projectPage');

async function login(page, email, password) {
  const lp = new LoginPage(page);
  await lp.login(email, password);
}

async function navigateToProject(page, projectName) {
  const pp = new ProjectPage(page);
  await pp.navigateToProject(projectName);
}

async function verifyTaskInColumn(page, taskName, columnName) {
  const pp = new ProjectPage(page);
  await pp.verifyTaskInColumn(taskName, columnName);
}

async function verifyTaskTags(page, taskName, expectedTags) {
  const pp = new ProjectPage(page);
  await pp.verifyTaskTags(taskName, expectedTags);
}

module.exports = { login, navigateToProject, verifyTaskInColumn, verifyTaskTags };
