const CliArgs = Object.freeze({
  WEBPACK_CONFIG: 'webpackConfig',
  MODULE_RESOLUTION: 'moduleResolution',
  EXPERIMENTAL_DECORATORS: 'experimentalDecorators',
  SYNTHETIC_IMPORTS: 'syntheticImports',
  TARGET: 'target',
  MODULE: 'module',
});

/**
 * Parses CLI args and outputs tuple of jsconfig options
 * and custom webpack path if provided.
 *
 * @param {object} argv Parsed cli arguments object.
 * @return {[object, string]} Tuple of jsconfig options and webpack config path.
 */
function parseArgs(argv) {
  if (typeof argv !== 'object') {
    throw new TypeError(
      `Unable to parse argv argument, ${typeof argv} type given.`
    );
  }

  const compilerOptions = Object.values(CliArgs)
    .filter((key) => key !== CliArgs.WEBPACK_CONFIG)
    .reduce((acc, cur) => {
      if (argv[cur]) {
        acc[cur] = argv[cur];
      }

      return acc;
    }, {});

  return [{ compilerOptions }, argv[CliArgs.WEBPACK_CONFIG] || ''];
}

module.exports = {
  CliArgs,
  parseArgs,
};
