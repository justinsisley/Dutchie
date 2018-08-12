const cp = require('child_process');
const inquirer = require('inquirer');
const GitHub = require('github-api');
const git = require('simple-git/promise')();
const changelog = require('./changelog');
const version = require('./version');

// eslint-disable-next-line no-console
const log = message => console.log(message);

module.exports = async ({ forceMajor, githubRelease }) => {
  // There can be no local modifications when performing a release
  const { files } = await git.status();
  if (files.length) {
    log('Error: Unable to create a new release with local changes\n');
    log(`You've modified the following file${files.length === 1 ? '' : 's'}:`);
    log(`${files.map(file => file.path).join('\n')}\n`);
    return;
  }

  let changes;

  // Create or update the changelog
  if (changelog.changelogExists()) {
    changes = await changelog.updateChangelog({ forceMajor });
  } else {
    changes = await changelog.createChangelog(version.getVersion());
  }

  // Add, commit, and push the changelog and package.json files
  await git.add([changelog.getChangelogPath(), version.getPackageJSONPath()]);
  await git.commit(`release: v${version.getVersion()}`);
  await git.push('origin');

  // Create and push a new tag for the release
  await git.tag([`v${version.getVersion()}`]);
  await git.pushTags('origin');

  // If we're not creating a GitHub release, we're done
  if (!githubRelease) return;

  // Prompt for GitHub credentials
  const credentials = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'GitHub Username',
    },
    {
      type: 'password',
      name: 'password',
      message: 'GitHub Password',
    },
  ]);

  const { username, password } = credentials;
  if (!username || !password) {
    log('Error: You provided invalid GitHub credentials\n');
    return;
  }

  // Configure GitHub API with credentials
  const github = new GitHub({ username, password });
  // Get the repository name
  const repoName = cp.execSync('basename -s .git `git config --get remote.origin.url`');
  // Get a reference to the repository
  const repo = github.getRepo(username, repoName);
  // Create the release
  await repo.createRelease({
    tag_name: `v${version.getVersion()}`,
    name: `v${version.getVersion()}`,
    body: changes,
  });
};
