const { webpackParser } = require('./parser/webpackParser');
const { argsParser } = require('./parser/argsParser');
const { templateParser } = require('./parser/templateParser');
const { nodeImportsParser } = require('./parser/nodeImportsParser');

const { persist, success, error, info } = require('./lib/utils');
const { argv } = require('./lib/yargs');

async function main() {
  info('Initializing jsconfig.json parser...');

  try {
    // Run parsers in series
    const { params, config } = await [
      argsParser,
      templateParser,
      webpackParser,
      nodeImportsParser
    ].reduce(
      (chain, parser, index) =>
        chain.then((...args) => {
          const parserName =
            parser.parserName || parser.name || `${index}. parser`;
          info(`Running: ${parserName}...`);

          return parser(...args);
        }),
      Promise.resolve({ params: { argv }, config: {} })
    );

    // Persist and generate new jsconfig.json
    await persist({ params, config });

    success(`jsconfig.json successfully generated at '${params.cwd}'.`);
    process.exit(0);
  } catch (e) {
    error(e);
    error(e.stack);
    process.exit(1);
  }
}

module.exports = { main };
