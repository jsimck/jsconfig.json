#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const merge = require('deepmerge');
const promisify = require('util').promisify;
const writeFile = promisify(fs.writeFile);

const argv = require('./lib/yargs');
const { parseWebpackConfig } = require('./lib/webpackParser');
const { parseArgs } = require('./lib/argsParser');

/**
 * Deep merges custom config with the one in the template and generates
 * new jsconfig.json file in the basePath.
 *
 * @param {string} basePath
 * @param {object} config jsconfig.json config to merge with template
 */
async function persist(basePath, config = {}) {
  const jsonConfigTpl = require(path.resolve(
    __dirname,
    './template/jsconfig.json'
  ));

  await writeFile(
    path.join(basePath, 'jsconfig.json'),
    JSON.stringify(merge(jsonConfigTpl, config), null, 2)
  );
}

(async function () {
  const baseUrl = path.join(argv._.length > 0 ? argv._[0] : './', '/');

  try {
    // Parse arguments and configurations
    const [parsedArgsOverrides, webpackConfigPath] = parseArgs(argv);
    const parsedWebpackConfigOverrieds = await parseWebpackConfig(
      webpackConfigPath,
      baseUrl
    );

    // Persist and generate new jsconfig.json
    await persist(
      baseUrl,
      merge(parsedArgsOverrides, parsedWebpackConfigOverrieds)
    );
  } catch (e) {
    console.error(e);
  }
})();
