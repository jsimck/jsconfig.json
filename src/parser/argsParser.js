import path from 'path';
import { CLIArgs } from '../lib/yargs';

const CompilerOptionKeys = [
  CLIArgs.MODULE_RESOLUTION,
  CLIArgs.EXPERIMENTAL_DECORATORS,
  CLIArgs.SYNTHETIC_IMPORTS,
  CLIArgs.TARGET,
  CLIArgs.MODULE,
  CLIArgs.BASE_URL
];

/**
 * Parses CLI args and custom webpack path if provided.
 *
 * @param {{ params, config }} args Object with params and config objects.
 * @return {Promise<{ params, config }>} Adjusted object with params and config objects.
 */
async function argsParser({ params, config }) {
  const { argv } = params;
  const cwd = argv?._?.length > 0 ? path.resolve(argv._[0]) : process.cwd();

  if (!cwd || typeof cwd !== 'string') {
    throw new TypeError(`Invalid cwd, '${cwd}' was given.`);
  }

  const compilerOptions = Object.values(CLIArgs)
    .filter((key) => CompilerOptionKeys.indexOf(key) !== -1)
    .reduce((acc, cur) => {
      if (argv?.[cur]) {
        acc[cur] = argv[cur];
      }

      return acc;
    }, {});

  return {
    params: {
      ...params,
      cwd,
      template: argv?.[CLIArgs.TEMPLATE] || 'default',
      webpackConfigLocation:
        argv?.[CLIArgs.WEBPACK_CONFIG] || path.join(cwd, 'webpack.config.js')
    },
    config: {
      ...config,
      compilerOptions
    }
  };
}

argsParser.parserName = 'args parser';

export { argsParser, CompilerOptionKeys };
