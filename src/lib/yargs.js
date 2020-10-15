const yargs = require('yargs');
const { CliArgs } = require('./argsParser');

/**
 * Option descriptions are taken directly from the jsconfig documentation
 * https://code.visualstudio.com/docs/languages/jsconfig
 */
const cliYargs = yargs
  .usage('Usage: npx jsconfig.json <baseFolder> [options]')
  .option({
    [CliArgs.WEBPACK_CONFIG]: {
      alias: 'c',
      description: 'Custom path to webpack.config.js',
      type: 'string',
    },
    [CliArgs.TARGET]: {
      alias: 't',
      default: 'es2020',
      type: 'string',
      description: 'Specifies which default library (lib.d.ts) to use',
      choices: [
        'es3',
        'es5',
        'es6',
        'es2015',
        'es2016',
        'es2017',
        'es2018',
        'es2019',
        'es2020',
        'esnext',
      ],
    },
    [CliArgs.MODULE]: {
      alias: 'm',
      default: 'es2015',
      type: 'string',
      description: 'Specifies the module system, when generating module code',
      choices: [
        'amd',
        'commonJS',
        'es2015',
        'es6',
        'esnext',
        'none',
        'system',
        'umd',
      ],
    },
    [CliArgs.MODULE_RESOLUTION]: {
      alias: 'r',
      default: 'node',
      type: 'string',
      description: 'Specifies how modules are resolved for imports',
      choices: ['node', 'classic'],
    },
    [CliArgs.EXPERIMENTAL_DECORATORS]: {
      alias: 'e',
      type: 'boolean',
      description: 'Enables experimental support for proposed ES decorators',
    },
    [CliArgs.SYNTHETIC_IMPORTS]: {
      alias: 's',
      type: 'boolean',
      description:
        'Allow default imports from modules with no default export. This does not affect code emit, just type checking.',
    },
  })
  .wrap(Math.min(110, yargs.terminalWidth())).argv;

module.exports = cliYargs;
