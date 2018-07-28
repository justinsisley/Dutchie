const fs = require('fs');
const path = require('path');
const commitTypes = require('conventional-commit-types');
const parentPackageJSON = require('parent-package-json');
const git = require('simple-git/promise')();
const version = require('./version');

// Naming and titles
const filename = 'CHANGELOG.md';
const documentTitle = '# Changelog';
const getReleaseTitle = semver => `## v${semver}`;

// Build up a regex string to identify known commit types
const commitTypeRegexString = Object.keys(commitTypes.types)
  .map(type => type)
  .join('|');
// Detect the commit type
const commitTypeRegex = new RegExp(`^(${commitTypeRegexString}):`);
// Detect if commit is a feature commit
const featureRegex = new RegExp('^(feat):');
// Find the most recent commit hash
const mostRecentCommitRegex = /\[([a-z0-9]{7})\]\n/;
// Find commit message artifacts that don't add value to the overall message
const commitMessageArtifactsRegex = /\s\((HEAD|origin)[^)]+\)$/;
// Commits that will be left out of the changelog
const messageBlacklist = /^(Merge pull request|Merge remote-tracking branch|release: v)/i;

// Get the file path of the parent project's changelog
// NOTE: this will fall back to this project's changelog for dev purposes
function getChangelogPath() {
  const parent = parentPackageJSON(path.join(__dirname, '../'));
  if (parent) return path.join(parent.path, '../', filename);
  return path.join(require.resolve('../package.json'), '../', filename);
}

// Determine if a changelog exists
const changelogExists = () => fs.existsSync(getChangelogPath());
// Read the changelog as a string
const readChangelog = () => fs.readFileSync(getChangelogPath(), { encoding: 'utf8' });

// Given a commit hash and message, generate a single changelog line
function createCommitMessage({ hash, message }) {
  const shortHash = hash.substring(0, 7);

  // Remove strings like "(HEAD -> master, origin/master)" from the end of the message
  const cleanMessage = message.replace(commitMessageArtifactsRegex, '');

  // Add styling to commit type prefixes for better readability
  const styledMessage = cleanMessage.replace(
    commitTypeRegex,
    match => `__${match}__`,
  );

  // Final formatting
  return `- ${styledMessage} [${shortHash}]\n`;
}

// Parse the changelog and find the most recent commit of the most recent release
function getLastChangelogCommit() {
  const result = mostRecentCommitRegex.exec(readChangelog());
  return result && result[1];
}

// Generate a new changelog and backfill old commits
async function createChangelog(semver) {
  // Get the log starting from the beginning of time
  const gitLog = await git.log();

  // Add the document title
  const contents = [`${documentTitle}\n\n`];

  // Use the current version in package.json
  contents.push(`${getReleaseTitle(semver)}\n\n`);

  // Remove blacklisted commits
  const commits = gitLog.all.filter(
    ({ message }) => !messageBlacklist.test(message.toLowerCase()),
  );

  // Generate the list of changes
  commits.forEach((commit) => {
    const { message, hash } = commit;
    contents.push(createCommitMessage({ hash, message }));
  });

  // Create the new changelog
  fs.writeFileSync(getChangelogPath(), contents.join(''));
}

// Update an existing changelog with all commits since the last version
async function updateChangelog({ forceMajor }) {
  const lastChangelogCommit = getLastChangelogCommit();

  // If we're performing an update but there's no previous commit, something
  // is wrong with the existing changelog
  if (!lastChangelogCommit) return;

  // Get the log starting from the last released commit
  const gitLog = await git.log({ from: lastChangelogCommit, to: 'HEAD' });

  // Default release type is "patch"
  let versionBumpType = 'patch';

  // Remove blacklisted commits
  const commits = gitLog.all.filter(
    ({ message }) => !messageBlacklist.test(message.toLowerCase()),
  );

  // Generate the list of changes
  const changes = commits.map((commit) => {
    const { message, hash } = commit;
    // If any of the commits includes a feature, release type is changed to "minor"
    if (featureRegex.test(message)) versionBumpType = 'minor';
    return createCommitMessage({ hash, message });
  });

  // Allow user to force a major version bump
  if (forceMajor) versionBumpType = 'major';

  // If there haven't been any commits, stop
  if (!changes.length) return;

  // Bump the version based on the commit types in this release
  const semver = version.bumpVersion(versionBumpType);

  // Modify the changelog
  const markdown = readChangelog();
  const latestChanges = changes.join('');
  const previousChanges = markdown.split(documentTitle)[1];
  const changelog = `${documentTitle}\n\n${getReleaseTitle(
    semver,
  )}\n\n${latestChanges}${previousChanges}`;

  fs.writeFileSync(getChangelogPath(), changelog);
}

module.exports = {
  getChangelogPath,
  changelogExists,
  getLastChangelogCommit,
  createCommitMessage,
  createChangelog,
  updateChangelog,
};
