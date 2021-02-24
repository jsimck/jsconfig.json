const path = require('path');
const { CLIArgs, argv } = require('../lib/yargs');

/**
 * Parses CLI args and custom webpack path if provided.
 *
 * @param {{ params, config }} args Object with params and config objects.
 * @return {Promise<{ params, config }>} Adjusted object with params and config objects.
 */
async function argsParser({ params, config }) {
  const baseUrl = path.join(argv._.length > 0 ? argv._[0] : './', '/');

  if (typeof argv !== 'object') {
    throw new TypeError(
      `Unable to parse argv argument, ${typeof argv} type given.`
    );
  }

  const compilerOptions = Object.values(CLIArgs)
    .filter((key) => key !== CLIArgs.WEBPACK_CONFIG)
    .reduce((acc, cur) => {
      if (argv[cur]) {
        acc[cur] = argv[cur];
      }

      return acc;
    }, {});

  return {
    params: {
      ...params,
      baseUrl,
      webpackConfigLocation:
        argv[CLIArgs.WEBPACK_CONFIG] || path.join(baseUrl, 'webpack.config.js'),
    },
    config: {
      ...config,
      compilerOptions,
    },
  };
}

module.exports = {
  CLIArgs,
  argsParser,
};
