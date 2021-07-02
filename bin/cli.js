#!/usr/bin/env node

const { main } = require('../src');

(async function () {
  await main();

  process.exit(0);
})();
