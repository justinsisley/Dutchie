const git = require('simple-git/promise')();
const changelog = require('./changelog');
const version = require('./version');

// eslint-disable-next-line no-console
const log = message => console.log(message);

module.exports = async ({ forceMajor }) => {
  // There can be no local modifications when performing a release
  const { files } = await git.status();
  if (files.length) {
    log('Error: Unable to create a new release with local changes\n');
    log(`You've modified the following file${files.length === 1 ? '' : 's'}:`);
    log(`${files.map(file => file.path).join('\n')}\n`);
    return;
  }

  // Create or update the changelog
  if (changelog.changelogExists()) {
    await changelog.updateChangelog({ forceMajor });
  } else {
    await changelog.createChangelog(version.getVersion());
  }

  // Add, commit, and push the changelog and package.json files
  await git.add([changelog.getChangelogPath(), version.getPackageJSONPath()]);
  await git.commit(`release: v${version.getVersion()}`);
  await git.push('origin');

  // Create and push a new tag for the release
  await git.tag([`v${version.getVersion()}`]);
  await git.pushTags('origin');
};
