#!/usr/bin/env node

const { main } = require('../src');

(async function () {
  await main();

  process.exit(0);
})();

// Make sure it handles process exit correctly
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('SIGUSR2', () => process.exit(0));
process.on('exit', () => process.exit(0));
