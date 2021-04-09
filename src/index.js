import { webpackParser } from './parser/webpackParser';
import { argsParser } from './parser/argsParser';
import { templateParser } from './parser/templateParser';
import { persist, success, error, info } from './lib/utils';
import { argv } from './lib/yargs';

async function main() {
  const parsers = [argsParser, templateParser, webpackParser];
  info('Initializing jsconfig.json parser...');

  try {
    // Run parsers in series
    const { params, config } = await parsers.reduce(
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

export { main };
