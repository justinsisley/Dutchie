const fs = require('fs');
const parentPackageJSON = require('parent-package-json');

// Get the parent project's package.json path
// NOTE: this will fall back to this project's package.json for dev purposes
function getPackageJSONPath() {
  const parent = parentPackageJSON();
  if (parent) return parent;
  return require.resolve('../package.json');
}

// Read package.json as a string
const readPackageJSON = () => fs.readFileSync(getPackageJSONPath(), { encoding: 'utf8' });

// Parse the package.json into an object
const getParsedPackageJSON = () => JSON.parse(readPackageJSON());

// Get the current version from package.json
const getVersion = () => getParsedPackageJSON().version;

// Update the version property in package.json
function setVersion(version) {
  const json = getParsedPackageJSON();
  json.version = version;
  fs.writeFileSync(getPackageJSONPath(), JSON.stringify(json, null, 2));
}

// Increment the version property in package.json based on the semver type and
// return the new version number
function bumpVersion(type) {
  const version = getVersion();
  const split = version.split('.');
  let major = split[0];
  let minor = split[1];
  let patch = split[2];

  if (type === 'patch') {
    patch = parseInt(patch, 10) + 1;
  }

  if (type === 'minor') {
    minor = parseInt(minor, 10) + 1;
    patch = 0;
  }

  if (type === 'major') {
    major = parseInt(major, 10) + 1;
    minor = 0;
    patch = 0;
  }

  const newVersion = [major, minor, patch].join('.');
  setVersion(newVersion);
  return newVersion;
}

module.exports = {
  getPackageJSONPath,
  getVersion,
  setVersion,
  bumpVersion,
};
