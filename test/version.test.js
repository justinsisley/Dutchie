const fs = require('fs');
const version = require('../lib/version');

const { getPackageJSONPath } = version;

describe('version', () => {
  describe('getPackageJSONPath', () => {
    test('returns a path to a package.json file', () => {
      expect(fs.existsSync(getPackageJSONPath()));
    });
  });
});
