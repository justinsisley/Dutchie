const release = require('../lib/release');

describe('release', () => {
  test('returns a function', () => {
    expect(typeof release).toEqual('function');
  });
});
