const path = require('path');
const { main } = require('../index');
const { argv } = require('../lib/yargs');
const utils = require('../lib/utils');

describe('main()', () => {
  let result;

  beforeEach(() => {
    result = null;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
    jest.spyOn(utils, 'persist').mockImplementation((arg) => {
      result = { ...arg };
    });
  });

  it('should work with defaults', async () => {
    argv.webpackConfig = path.resolve(
      __dirname,
      '../../__mocks__/webpackConfigMock.js'
    );

    await main();

    expect(result).toStrictEqual({
      config: {
        compilerOptions: {
          baseUrl: '.',
          module: 'es2015',
          moduleResolution: 'node',
          paths: {
            '@library/*': ['lib/core/index.es5/*']
          },
          target: 'es2020'
        }
      },
      params: {
        argv: expect.any(Object),
        cwd: expect.any(String),
        template: 'default',
        webpackConfigLocation: expect.any(String)
      }
    });
  });
});
