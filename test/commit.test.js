const commit = require('../lib/commit');

describe('commit', () => {
  test('returns a function', () => {
    expect(typeof commit).toEqual('function');
  });
});
