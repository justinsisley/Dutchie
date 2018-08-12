const cp = require('child_process');
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

  // We'll need the changes later if the user chose to create a GitHub release
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

  if (!process.env.GITHUB_TOKEN) {
    log('Error: You must have a GITHUB_TOKEN environment variable\n');
    return;
  }

  // Configure GitHub API with credentials
  const github = new GitHub({ token: process.env.GITHUB_TOKEN });
  // Get the repository name
  const remoteOriginUrl = await git.raw(['config', '--get', 'remote.origin.url']);
  const gitHubOriginPrefix = 'git@github.com:';

  if (!remoteOriginUrl.includes(gitHubOriginPrefix)) {
    log(`Error: Unable to parse remote origin URL: ${remoteOriginUrl}\n`);
    return;
  }

  // Extract user repo username/organization and the repo name
  const [username, repoName] = remoteOriginUrl
    .replace(gitHubOriginPrefix, '')
    .replace(/\.git$/, '')
    .split('/');

  // Get a reference to the repository
  const repo = github.getRepo(username, repoName);

  // Create the release
  try {
    await repo.createRelease({
      tag_name: `v${version.getVersion()}`,
      name: `v${version.getVersion()}`,
      body: changes,
    });
  } catch (error) {
    log('Error: Unable to create GitHub release\n');
    log(error);
  }
};
