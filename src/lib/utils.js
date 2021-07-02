const path = require('path');
const fs = require('fs');
const merge = require('deepmerge');
const { promisify } = require('util');
const chalk = require('chalk');

const writeFile = promisify(fs.writeFile);
const JSCONFIG_JSON_FILENAME = 'jsconfig.json';

/**
 * Deep merges custom config with the one in the template and generates
 * new jsconfig.json file in working directory.
 *
 * @param {{ params, config }} args Object with params and config objects,
 *        used to carry config and params across parsers.
 * @return {Promise<void>}
 */
async function persist({
  params: { output, cwd, template } = {},
  config = {}
} = {}) {
  info(`Generating jsconfig with '${template}' template...`);

  const jsonConfigTpl = require(path.resolve(
    __dirname,
    '..',
    '..',
    'template',
    `${template}.json`
  ));

  let outputDir = cwd;
  if (output) {
    outputDir = path.isAbsolute(output) ? output : path.resolve(output);
  }

  if (!fs.existsSync(outputDir)) {
    warn("Output directory doesn't exist and will be created.");
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return writeFile(
    path.join(outputDir, JSCONFIG_JSON_FILENAME),
    JSON.stringify(merge(jsonConfigTpl, config), null, 2)
  );
}

function error(...args) {
  console.log(chalk.bold.red('error: '), chalk.white(...args));
}

function success(...args) {
  console.log(chalk.bold.green('success: '), chalk.white(...args));
}

function info(...args) {
  console.log(chalk.bold.cyan('info: '), chalk.white(...args));
}

function warn(...args) {
  console.log(chalk.bold.yellow('warn: '), chalk.white(...args));
}

module.exports = { persist, error, info, success, warn };
