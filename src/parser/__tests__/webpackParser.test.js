const { extractPaths, webpackParser } = require('../webpackParser');

jest.mock('path', () => ({
  resolve: jest.fn(() => 'resolved-path'),
  relative: jest.fn((from, to) => `${from}=>${to}`),
}));

describe('extractPaths()', () => {
  it('should return null when there are no webpack aliases defined', () => {
    expect(extractPaths({}, '')).toBeNull();
    expect(
      extractPaths(
        {
          resolve: {},
        },
        ''
      )
    ).toBeNull();
    expect(
      extractPaths(
        {
          resolve: {
            alias: null,
          },
        },
        ''
      )
    ).toBeNull();

    expect(
      extractPaths(
        {
          resolve: {
            alias: {},
          },
        },
        ''
      )
    ).toBeNull();
  });

  it('should parse webpack aliases correctly', () => {
    expect(
      extractPaths(
        {
          resolve: {
            alias: {
              shared: 'packages/shared/src/',
              src: 'src/',
            },
          },
        },
        ''
      )
    ).toStrictEqual({
      'shared/*': ['=>packages/shared/src//*'],
      'src/*': ['=>src//*'],
    });
  });

  it('should parse webpack aliases correctly with custom baseUrl', () => {
    expect(
      extractPaths(
        {
          resolve: {
            alias: {
              shared: 'packages/shared/src/',
              src: 'src/',
            },
          },
        },
        './lib/src'
      )
    ).toStrictEqual({
      'shared/*': ['./lib/src=>packages/shared/src//*'],
      'src/*': ['./lib/src=>src//*'],
    });
  });
});

describe('webpackParser()', () => {
  it('should return input without any modifications if webpack file does not exist', async () => {
    expect(await webpackParser({ params: {}, config: {} })).toStrictEqual({
      params: {},
      config: {},
    });
  });
});
