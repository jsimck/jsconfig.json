const path = require('path');
const fs = require('fs');
const merge = require('deepmerge');
const promisify = require('util').promisify;
const writeFile = promisify(fs.writeFile);

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
    '../template/jsconfig.json'
  ));

  return writeFile(
    path.join(basePath, 'jsconfig.json'),
    JSON.stringify(merge(jsonConfigTpl, config), null, 2)
  );
}

module.exports = {
  persist,
};
