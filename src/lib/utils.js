const path = require('path');
const fs = require('fs');
const merge = require('deepmerge');
const promisify = require('util').promisify;
const writeFile = promisify(fs.writeFile);
const chalk = require('chalk');

/**
 * Deep merges custom config with the one in the template and generates
 * new jsconfig.json file in the basePath.
 *
 * @param {object} params Params object containing parser related information.
 * @param {object} [config = {}] jsconfig.json config to merge with template.
 */
async function persist({ cwd, template }, config = {}) {
  info(`Generating jsconfig with '${template}' template...`);

  const jsonConfigTpl = require(path.resolve(
    __dirname,
    `../../template/${template}.json`
  ));

  return writeFile(
    path.join(cwd, 'jsconfig.json'),
    JSON.stringify(merge(jsonConfigTpl, config), null, 2)
  );
}

function error(...args) {
  console.log(chalk.red('error -'), chalk.white(...args));
}

function success(...args) {
  console.log(chalk.green('success -'), chalk.white(...args));
}

function info(...args) {
  console.log(chalk.cyan('info -'), chalk.white(...args));
}

module.exports = {
  persist,
  error,
  info,
  success,
};
