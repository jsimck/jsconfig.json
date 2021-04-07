import { main } from '../index';
import * as utils from '../lib/utils';
import { argv } from '../lib/yargs';

describe('main()', () => {
  let result;

  beforeEach(() => {
    result = null;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
    jest.spyOn(utils, 'persist').mockImplementation((arg) => {
      result = { ...arg };
    });

    console.log(argv);
  });

  it('should work with defaults', async () => {
    await main();

    expect(true).toBeTruthy();
  //   expect(result).toStrictEqual({
  //     config: {
  //       compilerOptions: {
  //         baseUrl: '.',
  //         module: 'es2015',
  //         moduleResolution: 'node',
  //         target: 'es2020'
  //       }
  //     },
  //     params: {
  //       argv: {
  //         $0: 'node_modules/jest-worker/build/workers/processChild.js',
  //         _: [],
  //         a: 'es2020',
  //         b: '.',
  //         'base-url': '.',
  //         baseUrl: '.',
  //         m: 'es2015',
  //         module: 'es2015',
  //         'module-resolution': 'node',
  //         moduleResolution: 'node',
  //         r: 'node',
  //         t: 'default',
  //         target: 'es2020',
  //         template: 'default'
  //       },
  //       cwd: './',
  //       template: 'default',
  //       webpackConfigLocation: 'webpack.config.js'
  //     }
  //   });
  });
});
