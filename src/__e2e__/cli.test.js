const path = require('path');
const { spawn } = require('child_process');

async function runTest(name, cliArgs = [], cwd = null) {
  return new Promise((resolve, reject) => {
    const cli = spawn(
      'node',
      [
        path.resolve(__dirname, '../cli.js'),
        `--output=${path.resolve(__dirname, `./results/${name}`)}`,
        ...cliArgs,
        ...(cwd ? [cwd] : [])
      ],
      {
        // Set to 'inherit' for debugging
        stdio: 'inherit'
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

describe('jsconfig.json CLI', () => {
  it('should generate basic jsconfig.json', async () => {
    expect(await runTest('default')).toMatchSnapshot();
  });

  it('should work with custom cwd', async () => {
    expect(
      await runTest('aliases', [], './src/__e2e__/mocks/aliases')
    ).toMatchSnapshot();
  });

  it('should work with custom webpack location and baseUrl', async () => {
    expect(
      await runTest('customConfig', [
        '--baseUrl=./myApp/custom/location',
        `--webpackConfig=${path.resolve(
          __dirname,
          './mocks/customConfig/custom.webpack.js'
        )}`
      ])
    ).toMatchSnapshot();
  });

  it.each(
    ['default', 'nextjs', 'react', 'vuejs', 'node'].map((name) => [name])
  )('should generate jsconfig.json for %s template correctly', async (name) => {
    expect(await runTest(name, [`--template=${name}`])).toMatchSnapshot();
  });

  it('should merge path aliases with default template', async () => {
    expect(
      await runTest('templateOverride', [
        '--baseUrl=./myApp/custom/location',
        '--template=nextjs',
        `--webpackConfig=${path.resolve(
          __dirname,
          './mocks/customConfig/custom.webpack.js'
        )}`
      ])
    ).toMatchSnapshot();
  });

  it('should allow cli args overrides', async () => {
    expect(
      await runTest('cliArgsOverride', [
        '--baseUrl=./myApp/custom/location',
        '--template=nextjs',
        '--module=amd',
        '--target=es3',
        '--moduleResolution=classic',
        '--experimentalDecorators=false',
        '--syntheticImports=false',
        `--webpackConfig=${path.resolve(
          __dirname,
          './mocks/customConfig/custom.webpack.js'
        )}`
      ])
    ).toMatchSnapshot();
  });
});
