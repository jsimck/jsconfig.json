const fs = require('fs');
const { importsToPaths, nodeImportsParser } = require('../nodeImportsParser');

describe('importsToPaths()', () => {
  it('should filter non-string values', () => {
    expect(
      importsToPaths({
        '#constants/*': {},
        '#libs/*': null,
        '#router/*': './router/*.js',
        '#internal/*': './src/internal/*.js'
      })
    ).toStrictEqual({
      '#internal/*': ['./src/internal/*'],
      '#router/*': ['./router/*']
    });
  });

  it('should merge contents with webpack parsed paths', () => {
    expect(
      importsToPaths(
        {
          '#router/*': './router/*.js',
          '#libs/*': './libs/*.js',
          '#internal/*': './src/internal/*.js'
        },
        {
          compilerOptions: {
            paths: {
              '#internal/*': ['./client/webpack/internal/path'],
              '#libs/*': ['./libs/*']
            }
          }
        }
      )
    ).toStrictEqual({
      '#internal/*': ['./client/webpack/internal/path', './src/internal/*'],
      '#router/*': ['./router/*'],
      '#libs/*': ['./libs/*']
    });
  });
});

describe('nodeImportsParser()', () => {
  let baseConfig = {
    params: {
      cwd: './'
    },
    config: {
      compilerOptions: {
        baseUrl: './',
        paths: {
          '@library/*': ['./=>lib/core/index.es5/*']
        }
      }
    }
  };

  it('should return input args if package.json does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect(await nodeImportsParser(baseConfig)).toStrictEqual(baseConfig);
  });
});
