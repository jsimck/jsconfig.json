const path = require('path');
const {
  extractPaths,
  parseWebpackConf,
  webpackParser
} = require('../webpackParser');

describe('extractPaths()', () => {
  beforeEach(() => {
    jest
      .spyOn(path, 'relative')
      .mockImplementation((from, to) => `${from}=>${to}`);
  });

  it.each([
    [
      {
        resolve: {}
      },
      {
        compilerOptions: {
          baseUrl: `.${path.sep}`
        }
      }
    ],
    [
      {
        resolve: {
          alias: null
        }
      },
      {
        compilerOptions: {
          baseUrl: `.${path.sep}`
        }
      }
    ],
    [
      {
        resolve: {
          alias: {}
        }
      },
      {}
    ]
  ])(
    'should return {} for %j webpack conf and %j config',
    (webpackConf, config) => {
      expect(extractPaths(webpackConf, config)).toStrictEqual({});
    }
  );

  it.each([
    [
      {
        compilerOptions: {
          baseUrl: path.join('.', 'lib', 'src')
        }
      },
      {
        paths: {
          [path.join('shared', '*')]: [
            `${path.join('.', 'lib', 'src')}=>${path.join(
              'packages',
              'shared',
              'src',
              '*'
            )}`
          ],
          [path.join('src', '*')]: [
            `${path.join('.', 'lib', 'src')}=>${path.join('src', '*')}`
          ]
        },
        baseUrl: path.join('.', 'lib', 'src')
      }
    ],
    [
      {
        compilerOptions: {
          baseUrl: `.${path.sep}`
        }
      },
      {
        paths: {
          [path.join('shared', '*')]: [
            `.${path.sep}=>${path.join('packages', 'shared', 'src', '*')}`
          ],
          [path.join('src', '*')]: [`.${path.sep}=>${path.join('src', '*')}`]
        },
        baseUrl: `.${path.sep}`
      }
    ]
  ])(
    'should parse webpack aliases with baseUrl %j correctly',
    (baseUrl, result) => {
      expect(
        extractPaths(
          {
            resolve: {
              alias: {
                shared: path.join('packages', 'shared', 'src'),
                src: 'src'
              }
            }
          },
          baseUrl
        )
      ).toStrictEqual(result);
    }
  );
});

describe('parseWebpackConf()', () => {
  const parseWebpackConfFactory = async (webpackConf) =>
    parseWebpackConf(
      webpackConf,
      {
        webpackConfigLocation: 'webpack.conf.js'
      },
      {
        compilerOptions: {
          baseUrl: path.join('.', 'lib', 'src')
        }
      }
    );

  const baseWebpackConfig = {
    resolve: {
      alias: {
        shared: path.join('packages', 'shared', 'src'),
        src: 'src'
      }
    }
  };

  it.each([
    ['object', baseWebpackConfig],
    ['promise', Promise.resolve(baseWebpackConfig)],
    ['function', () => baseWebpackConfig],
    ['array', [baseWebpackConfig, baseWebpackConfig, baseWebpackConfig]]
  ])(
    'should generate valid webpack config for "%s" type of webpack config',
    async (type, webpackConf) => {
      expect(await parseWebpackConfFactory(webpackConf)).toStrictEqual({
        config: {
          compilerOptions: {
            baseUrl: path.join('.', 'lib', 'src'),
            paths: {
              [path.join('shared', '*')]: [
                `${path.join('.', 'lib', 'src')}=>${path.join(
                  'packages',
                  'shared',
                  'src',
                  '*'
                )}`
              ],
              [path.join('src', '*')]: [
                `${path.join('.', 'lib', 'src')}=>${path.join('src', '*')}`
              ]
            }
          }
        },
        params: { webpackConfigLocation: 'webpack.conf.js' }
      });
    }
  );

  it('should not append baseUrl when there are no paths', async () => {
    expect(
      await parseWebpackConf(
        { resolve: {} },
        {
          webpackConfigLocation: 'webpack.conf.js'
        },
        {}
      )
    ).toStrictEqual({
      config: {},
      params: { webpackConfigLocation: 'webpack.conf.js' }
    });
  });

  it('should correctly resolve duplicate paths with array of webpack configs', async () => {
    expect(
      await parseWebpackConfFactory([
        baseWebpackConfig,
        {
          resolve: {
            alias: {
              [path.join('@', 'components')]: path.join('@', 'components')
            }
          }
        },
        baseWebpackConfig
      ])
    ).toStrictEqual({
      config: {
        compilerOptions: {
          baseUrl: path.join('.', 'lib', 'src'),
          paths: {
            [path.join('@', 'components', '*')]: [
              `${path.join('.', 'lib', 'src')}=>${path.join(
                '@',
                'components',
                '*'
              )}`
            ],
            [path.join('shared', '*')]: [
              `${path.join('.', 'lib', 'src')}=>${path.join(
                'packages',
                'shared',
                'src',
                '*'
              )}`
            ],
            [path.join('src', '*')]: [
              `${path.join('.', 'lib', 'src')}=>${path.join('src', '*')}`
            ]
          }
        }
      },
      params: { webpackConfigLocation: 'webpack.conf.js' }
    });
  });

  it.each([
    ['object', {}],
    ['promise', Promise.resolve({})],
    ['function', () => ({})],
    ['array', [{}, { resolve: {} }, { resolve: { alias: {} } }]]
  ])(
    'should work when there are no aliases defined for %s-type webpack config',
    async (type, webpackConf) => {
      expect(await parseWebpackConfFactory(webpackConf)).toStrictEqual({
        config: {
          compilerOptions: {
            baseUrl: path.join('.', 'lib', 'src')
          }
        },
        params: { webpackConfigLocation: 'webpack.conf.js' }
      });
    }
  );

  it.each([[null], [undefined], ['webpack'], [123321]])(
    'should throw type error for invalid input',
    async (webpackConf) => {
      expect.assertions(1);

      await expect(async () => {
        await parseWebpackConf(webpackConf, {}, {});
      }).rejects.toThrow(TypeError);
    }
  );

  it.each([[() => null], [Promise.resolve(2)], [() => 1]])(
    'should throw an unknown error for non-parsable config',
    async (webpackConf) => {
      expect.assertions(1);

      await expect(async () => {
        await parseWebpackConf(webpackConf, {}, {});
      }).rejects.toThrow(Error);
    }
  );
});

describe('webpackParser()', () => {
  it('should throw an error if webpack location is not provided', async () => {
    expect.assertions(1);

    await expect(async () => {
      await webpackParser({ params: {}, config: {} });
    }).rejects.toThrow(TypeError);
  });

  it('should return input without any modifications if webpack file does not exist', async () => {
    expect(
      await webpackParser({
        params: {
          webpackConfigLocation: 'non-existing-file'
        },
        config: {}
      })
    ).toStrictEqual({
      params: {
        webpackConfigLocation: 'non-existing-file'
      },
      config: {}
    });
  });

  it('should return parsed webpack config', async () => {
    expect(
      await webpackParser({
        params: {
          webpackConfigLocation: path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '__mocks__',
            'webpackConfigMock.js'
          )
        },
        config: {
          compilerOptions: {
            baseUrl: `.${path.sep}`
          }
        }
      })
    ).toStrictEqual({
      params: {
        webpackConfigLocation: expect.any(String)
      },
      config: {
        compilerOptions: {
          baseUrl: `.${path.sep}`,
          paths: {
            [path.join('@library', '*')]: [
              `${`.${path.sep}`}=>${path.join('lib', 'core', 'index.es5', '*')}`
            ]
          }
        }
      }
    });
  });
});
