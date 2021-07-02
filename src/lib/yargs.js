const yargs = require('yargs');
const CLIArgs = require('../constants/CLIArgs');

/**
 * Option descriptions are taken directly from the jsconfig documentation
 * https://code.visualstudio.com/docs/languages/jsconfig
 */
const argv = yargs
  .usage('Usage: npx jsconfig.json <srcPath> [options]')
  .strictOptions()
  .option({
    [CLIArgs.OUTPUT]: {
      alias: 'o',
      description:
        'Optional custom output directory for generated jsconfig.json file',
      type: 'string'
    },
    [CLIArgs.TEMPLATE]: {
      alias: 't',
      default: 'default',
      description: 'Base jsconfig.json template',
      choices: ['default', 'nextjs', 'react', 'vuejs', 'node']
    },
    [CLIArgs.BASE_URL]: {
      alias: 'b',
      description: 'Custom base url used for paths generation',
      type: 'string'
    },
    [CLIArgs.WEBPACK_CONFIG]: {
      alias: 'c',
      description: 'Custom path to webpack.config.js',
      type: 'string'
    },
    [CLIArgs.TARGET]: {
      alias: 'a',
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
        'esnext'
      ]
    },
    [CLIArgs.MODULE]: {
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
        'umd'
      ]
    },
    [CLIArgs.MODULE_RESOLUTION]: {
      alias: 'r',
      default: 'node',
      type: 'string',
      description: 'Specifies how modules are resolved for imports',
      choices: ['node', 'classic']
    },
    [CLIArgs.EXPERIMENTAL_DECORATORS]: {
      alias: 'e',
      type: 'boolean',
      description: 'Enables experimental support for proposed ES decorators'
    },
    [CLIArgs.SYNTHETIC_IMPORTS]: {
      alias: 's',
      type: 'boolean',
      description:
        'Allow default imports from modules with no default export. This does not affect code emit, just type checking.'
    }
  })
  .wrap(Math.min(110, yargs.terminalWidth())).argv;

module.exports = { argv };
