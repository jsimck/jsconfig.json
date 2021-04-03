#!/usr/bin/env node

const { webpackParser } = require('./parser/webpackParser');
const { argsParser } = require('./parser/argsParser');
const { persist, success, error, info } = require('./lib/utils');
const { argv } = require('./lib/yargs');

// TODO add support for custom parsers
// TODO better jsdoc?

(async function () {
  const parsers = [argsParser, webpackParser];
  info('Initializing jsconfig.json parser...');

  try {
    // Run parsers in series
    const { params, config } = await parsers.reduce(
      (chain, parser) => chain.then((...args) => parser(...args)),
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
