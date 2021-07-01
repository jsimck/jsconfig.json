#!/usr/bin/env node

const { main } = require('./index.js');

(async function () {
  await main();

  process.exit(0);
})();
