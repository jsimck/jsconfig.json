#!/usr/bin/env node

import { webpackParser } from './parser/webpackParser';
import { argsParser } from './parser/argsParser';
import { persist, success, error, info } from './lib/utils';
import { argv } from './lib/yargs';

// TODO add support for custom parsers
// TODO better jsdoc?

(async function () {
  const parsers = [argsParser, webpackParser];
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
})();
