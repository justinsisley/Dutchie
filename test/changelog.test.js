const fs = require('fs');
const changelog = require('../lib/changelog');

const { getChangelogPath, createCommitMessage, getLastChangelogCommit } = changelog;
const sampleHash = '8c52e96efb2b63409dec89adb605739ca579f77c';

describe('changelog', () => {
  describe('getChangelogPath', () => {
    test('returns a path to a changelog file', () => {
      expect(fs.existsSync(getChangelogPath()));
    });
  });

  describe('createCommitMessage', () => {
    test('returns a properly formatted string', () => {
      const result = createCommitMessage({
        hash: sampleHash,
        message: 'refactor: Updated docs; updated deps',
      });

      expect(result).toEqual('- __refactor:__ Updated docs; updated deps [8c52e96]\n');
    });
  });

  describe('getLastChangelogCommit', () => {
    test('returns a commit hash', () => {
      const result = getLastChangelogCommit();

      expect(typeof result).toEqual('string');
      expect(result.length).toEqual(7);
    });
  });
});
