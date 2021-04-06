import path from 'path';
import fs from 'fs';
import merge from 'deepmerge';
import { promisify } from 'util';
import chalk from 'chalk';

const writeFile = promisify(fs.writeFile);
const JSCONFIG_JSON_FILENAME = 'jsconfig.json';

/**
 * Deep merges custom config with the one in the template and generates
 * new jsconfig.json file in the basePath.
 *
 * @param {{ params, config }} args Object with params and config objects.
 * @return {Promise}
 */
async function persist({ params: { cwd, template } = {}, config = {} } = {}) {
  info(`Generating jsconfig with '${template}' template...`);

  const jsonConfigTpl = require(path.resolve(
    __dirname,
    `../../template/${template}.json`
  ));

  return writeFile(
    path.join(cwd, JSCONFIG_JSON_FILENAME),
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

export { persist, error, info, success };
