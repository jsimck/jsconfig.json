const path = require('path');
const { main } = require('../index');
const { argv } = require('../lib/yargs');
const utils = require('../lib/utils');

jest.mock('../lib/utils');

describe('main()', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  it('should work with defaults', async () => {
    argv.webpackConfig = path.resolve(
      __dirname,
      '../../__mocks__/webpackConfigMock.js'
    );

    await main();

    expect(utils.persist).toHaveBeenCalledWith({
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
