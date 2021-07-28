const path = require('path');
const { spawn } = require('child_process');
const pkgJson = require('../../package.json');

async function runTest(name, cliArgs = [], cwd = null) {
  return new Promise((resolve, reject) => {
    const cli = spawn(
      'node',
      [
        path.resolve(__dirname, '..', '..', pkgJson.bin['jsconfig.json']),
        `--output=${path.resolve(__dirname, 'results', name)}`,
        ...cliArgs,
        ...(cwd ? [cwd] : [])
      ],
      {
        // Set to 'inherit' for debugging
        stdio: 'ignore'
      }
    );

    cli.on('exit', () => {
      resolve(require(`./results/${name}/jsconfig.json`));
    });

    cli.on('error', (err) => {
      reject(err);
    });
  });
}

// TODO use snapshots and resolve windows path separators
describe('jsconfig.json CLI', () => {
  it('should generate basic jsconfig.json', async () => {
    expect(await runTest('default')).toStrictEqual({
      compilerOptions: {
        checkJs: false,
        module: 'es2015',
        moduleResolution: 'node',
        resolveJsonModule: true,
        target: 'es2020'
      },
      exclude: [
        'dist',
        'node_modules',
        'build',
        '.vscode',
        '.nuxt',
        'coverage',
        'jspm_packages',
        'tmp',
        'temp',
        'bower_components',
        '.npm',
        '.yarn'
      ],
      typeAcquisition: { enable: true }
    });
  });

  it('should work with custom cwd', async () => {
    expect(
      await runTest('aliases', [], './src/__e2e__/mocks/aliases')
    ).toStrictEqual({
      compilerOptions: {
        baseUrl: '.',
        checkJs: false,
        module: 'es2015',
        moduleResolution: 'node',
        paths: { [path.join('myApp', '*')]: [path.join('src', '*')] },
        resolveJsonModule: true,
        target: 'es2020'
      },
      exclude: [
        'dist',
        'node_modules',
        'build',
        '.vscode',
        '.nuxt',
        'coverage',
        'jspm_packages',
        'tmp',
        'temp',
        'bower_components',
        '.npm',
        '.yarn'
      ],
      typeAcquisition: { enable: true }
    });
  });

  it('should work with custom webpack location and baseUrl', async () => {
    expect(
      await runTest('customConfig', [
        `--baseUrl=${path.join('.', 'myApp', 'custom', 'location')}`,
        `--webpackConfig=${path.resolve(
          __dirname,
          'mocks',
          'customConfig',
          'custom.webpack.js'
        )}`
      ])
    ).toStrictEqual({
      compilerOptions: {
        baseUrl: path.join(`${path.join('.', 'myApp', 'custom', 'location')}`),
        checkJs: false,
        module: 'es2015',
        moduleResolution: 'node',
        paths: {
          [path.join('myApp', '*')]: [path.join('..', '..', '..', 'src', '*')]
        },
        resolveJsonModule: true,
        target: 'es2020'
      },
      exclude: [
        'dist',
        'node_modules',
        'build',
        '.vscode',
        '.nuxt',
        'coverage',
        'jspm_packages',
        'tmp',
        'temp',
        'bower_components',
        '.npm',
        '.yarn'
      ],
      typeAcquisition: { enable: true }
    });
  });

  it.each([
    [
      'default',
      {
        compilerOptions: {
          checkJs: false,
          module: 'es2015',
          moduleResolution: 'node',
          resolveJsonModule: true,
          target: 'es2020'
        },
        exclude: [
          'dist',
          'node_modules',
          'build',
          '.vscode',
          '.nuxt',
          'coverage',
          'jspm_packages',
          'tmp',
          'temp',
          'bower_components',
          '.npm',
          '.yarn'
        ],
        typeAcquisition: { enable: true }
      }
    ],
    [
      'nextjs',
      {
        compilerOptions: {
          baseUrl: '.',
          checkJs: false,
          module: 'es2015',
          moduleResolution: 'node',
          paths: {
            [path.join('@', 'components', '*')]: [path.join('components', '*')],
            [path.join('@', 'pages', '*')]: [path.join('pages', '*')],
            [path.join('@', 'styles', '*')]: [path.join('styles', '*')]
          },
          resolveJsonModule: true,
          target: 'es2020'
        },
        exclude: [
          'dist',
          'node_modules',
          'build',
          '.vscode',
          '.next',
          'coverage',
          '.npm',
          '.yarn'
        ],
        typeAcquisition: { enable: true, include: ['react', 'react-dom'] }
      }
    ],
    [
      'react',
      {
        compilerOptions: {
          baseUrl: 'src',
          checkJs: false,
          module: 'es2015',
          moduleResolution: 'node',
          resolveJsonModule: true,
          target: 'es2020'
        },
        exclude: [
          'dist',
          'node_modules',
          'build',
          '.vscode',
          'coverage',
          '.npm',
          '.yarn'
        ],
        typeAcquisition: {
          enable: true,
          include: ['react', 'react-dom', 'jest', 'testing-library__jest-dom']
        }
      }
    ],
    [
      'vuejs',
      {
        compilerOptions: {
          baseUrl: '.',
          checkJs: false,
          module: 'es2015',
          moduleResolution: 'node',
          paths: { [path.join('@', '*')]: [path.join('src', '*')] },
          resolveJsonModule: true,
          target: 'es2020'
        },
        exclude: [
          'dist',
          'node_modules',
          'build',
          '.vscode',
          '.nuxt',
          'coverage',
          '.npm',
          '.yarn'
        ],
        typeAcquisition: { enable: true }
      }
    ],
    [
      'node',
      {
        compilerOptions: {
          checkJs: false,
          module: 'es2015',
          moduleResolution: 'node',
          resolveJsonModule: true,
          target: 'es2020'
        },
        exclude: [
          'dist',
          'node_modules',
          'build',
          '.vscode',
          'coverage',
          '.npm',
          '.yarn'
        ],
        typeAcquisition: { enable: true, include: ['node'] }
      }
    ]
  ])(
    'should generate jsconfig.json for %s template correctly',
    async (name, result) => {
      expect(await runTest(name, [`--template=${name}`])).toStrictEqual(result);
    }
  );

  it('should merge path aliases with default template', async () => {
    expect(
      await runTest('templateOverride', [
        `--baseUrl=${path.join('.', 'myApp', 'custom', 'location')}`,
        '--template=nextjs',
        `--webpackConfig=${path.resolve(
          __dirname,
          'mocks',
          'customConfig',
          'custom.webpack.js'
        )}`
      ])
    ).toStrictEqual({
      compilerOptions: {
        baseUrl: path.join('myApp', 'custom', 'location'),
        checkJs: false,
        module: 'es2015',
        moduleResolution: 'node',
        paths: {
          [path.join('@', 'components', '*')]: [path.join('components', '*')],
          [path.join('@', 'pages', '*')]: [path.join('pages', '*')],
          [path.join('@', 'styles', '*')]: [path.join('styles', '*')],
          [path.join('myApp', '*')]: [path.join('..', '..', '..', 'src', '*')]
        },
        resolveJsonModule: true,
        target: 'es2020'
      },
      exclude: [
        'dist',
        'node_modules',
        'build',
        '.vscode',
        '.next',
        'coverage',
        '.npm',
        '.yarn'
      ],
      typeAcquisition: { enable: true, include: ['react', 'react-dom'] }
    });
  });

  it('should allow cli args overrides', async () => {
    expect(
      await runTest('cliArgsOverride', [
        `--baseUrl=${path.join('.', 'myApp', 'custom', 'location')}`,
        '--template=nextjs',
        '--module=amd',
        '--target=es3',
        '--moduleResolution=classic',
        '--experimentalDecorators=false',
        '--syntheticImports=false',
        `--webpackConfig=${path.resolve(
          __dirname,
          'mocks',
          'customConfig',
          'custom.webpack.js'
        )}`
      ])
    ).toStrictEqual({
      compilerOptions: {
        baseUrl: path.join('myApp', 'custom', 'location'),
        checkJs: false,
        module: 'amd',
        moduleResolution: 'classic',
        paths: {
          [path.join('@', 'components', '*')]: [path.join('components', '*')],
          [path.join('@', 'pages', '*')]: [path.join('pages', '*')],
          [path.join('@', 'styles', '*')]: [path.join('styles', '*')],
          [path.join('myApp', '*')]: [path.join('..', '..', '..', 'src', '*')]
        },
        resolveJsonModule: true,
        target: 'es3'
      },
      exclude: [
        'dist',
        'node_modules',
        'build',
        '.vscode',
        '.next',
        'coverage',
        '.npm',
        '.yarn'
      ],
      typeAcquisition: { enable: true, include: ['react', 'react-dom'] }
    });
  });

  it('should correctly parse node imports subpath patterns from package.json', async () => {
    expect(
      await runTest('nodeImports', [], './src/__e2e__/mocks/nodeImports')
    ).toStrictEqual({
      compilerOptions: {
        baseUrl: '.',
        checkJs: false,
        module: 'es2015',
        moduleResolution: 'node',
        paths: {
          '#internal/*': ['./src/internal/*'],
          '#libs/*': ['./src/libs/path/extra/*']
        },
        resolveJsonModule: true,
        target: 'es2020'
      },
      exclude: [
        'dist',
        'node_modules',
        'build',
        '.vscode',
        '.nuxt',
        'coverage',
        'jspm_packages',
        'tmp',
        'temp',
        'bower_components',
        '.npm',
        '.yarn'
      ],
      typeAcquisition: { enable: true }
    });
  });

  it('should merge webpack paths with nodejs imports', async () => {
    expect(
      await runTest(
        'nodeImportsWebpack',
        [],
        './src/__e2e__/mocks/nodeImportsWebpack'
      )
    ).toStrictEqual({
      compilerOptions: {
        baseUrl: '.',
        checkJs: false,
        module: 'es2015',
        moduleResolution: 'node',
        paths: {
          '#internal/*': ['./src/internal/*'],
          '#libs/*': ['./src/libs/path/extra/*'],
          [path.join('myApp', '*')]: [path.join('src', '*')]
        },
        resolveJsonModule: true,
        target: 'es2020'
      },
      exclude: [
        'dist',
        'node_modules',
        'build',
        '.vscode',
        '.nuxt',
        'coverage',
        'jspm_packages',
        'tmp',
        'temp',
        'bower_components',
        '.npm',
        '.yarn'
      ],
      typeAcquisition: { enable: true }
    });
  });
});
