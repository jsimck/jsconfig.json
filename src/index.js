const { webpackParser } = require('./parser/webpackParser');
const { argsParser } = require('./parser/argsParser');
const { persist } = require('./lib/utils');

(async function () {
  const parsers = [argsParser, webpackParser];

  try {
    // Run parsers in series
    const { params, config } = await parsers.reduce(
      (chain, parser) => chain.then((...args) => parser(...args)),
      Promise.resolve({ params: {}, config: {} })
    );

    // Persist and generate new jsconfig.json
    await persist(params.baseUrl, config);
  } catch (error) {
    console.error(error);
  }
})();
