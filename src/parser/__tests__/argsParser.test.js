const path = require('path');
const CLIArgs = require('../../constants/CLIArgs');
const { CompilerOptionKeys, argsParser } = require('../argsParser');

describe('CompilerOptionKeys', () => {
  it('should match snapshot', () => {
    expect(CompilerOptionKeys).toMatchInlineSnapshot(`
      Array [
        "moduleResolution",
        "experimentalDecorators",
        "syntheticImports",
        "target",
        "module",
        "baseUrl",
      ]
    `);
  });
});

describe('argsParser()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error for invalid cwd param', async () => {
    expect.assertions(1);
    let cwdMock = jest
      .spyOn(global.process, 'cwd')
      .mockImplementation(() => null);

    await expect(async () => {
      await argsParser({ params: {}, config: {} });
    }).rejects.toThrow(TypeError);

    cwdMock.mockRestore();
  });

  it('should parse params with defaults', async () => {
    expect.assertions(1);
    jest
      .spyOn(global.process, 'cwd')
      .mockImplementation(() => path.join('cwd', 'path'));

    expect(await argsParser({ params: {}, config: {} })).toStrictEqual({
      config: { compilerOptions: {} },
      params: {
        cwd: path.join('cwd', 'path'),
        output: undefined,
        template: 'default',
        webpackConfigLocation: path.join('cwd', 'path', 'webpack.config.js')
      }
    });
  });

  it('should parse custom args correctly', async () => {
    expect.assertions(1);
    jest.spyOn(global.process, 'cwd').mockImplementation(() => '/cwd/path');

    expect(
      await argsParser({
        params: {
          argv: {
            [CLIArgs.TEMPLATE]: 'react',
            [CLIArgs.WEBPACK_CONFIG]: 'webpack.config.common.js',
            [CLIArgs.EXPERIMENTAL_DECORATORS]: true,
            [CLIArgs.SYNTHETIC_IMPORTS]: false,
            [CLIArgs.MODULE_RESOLUTION]: 'classic',
            [CLIArgs.MODULE]: 'amd',
            [CLIArgs.TARGET]: 'es3',
            [CLIArgs.BASE_URL]: './src'
          }
        },

        config: {}
      })
    ).toMatchInlineSnapshot(`
      Object {
        "config": Object {
          "compilerOptions": Object {
            "baseUrl": "./src",
            "experimentalDecorators": true,
            "module": "amd",
            "moduleResolution": "classic",
            "target": "es3",
          },
        },
        "params": Object {
          "argv": Object {
            "baseUrl": "./src",
            "experimentalDecorators": true,
            "module": "amd",
            "moduleResolution": "classic",
            "syntheticImports": false,
            "target": "es3",
            "template": "react",
            "webpackConfig": "webpack.config.common.js",
          },
          "cwd": "/cwd/path",
          "output": undefined,
          "template": "react",
          "webpackConfigLocation": "webpack.config.common.js",
        },
      }
    `);
  });
});
