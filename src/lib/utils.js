const path = require('path');
const fs = require('fs');
const merge = require('deepmerge');
const { promisify } = require('util');
const pc = require('picocolors');

const writeFile = promisify(fs.writeFile);
const JSCONFIG_JSON_FILENAME = 'jsconfig.json';

function fixPathSeparators(template) {
  const templateCopy = { ...template };
  const fixSeparators = (str) => {
    return str.replace(/\//gi, path.sep);
  };

  if (templateCopy.compilerOptions && templateCopy.compilerOptions.baseUrl) {
    templateCopy.compilerOptions.baseUrl = fixSeparators(
      templateCopy.compilerOptions.baseUrl
    );
  }

  if (templateCopy.compilerOptions && templateCopy.compilerOptions.paths) {
    const newPaths = Object.keys(templateCopy.compilerOptions.paths).reduce(
      (acc, cur) => {
        acc[fixSeparators(cur)] = templateCopy.compilerOptions.paths[cur].map(
          (path) => fixSeparators(path)
        );

        return acc;
      },
      {}
    );

    templateCopy.compilerOptions.paths = newPaths;
  }

  return templateCopy;
}

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

  const jsonConfigTpl = fixPathSeparators(
    require(path.resolve(__dirname, '..', '..', 'template', `${template}.json`))
  );

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
  console.log(pc.red('error: '), pc.white(...args));
}

function success(...args) {
  console.log(pc.green('success: '), pc.white(...args));
}

function info(...args) {
  console.log(pc.cyan('info: '), pc.white(...args));
}

function warn(...args) {
  console.log(pc.yellow('warn: '), pc.white(...args));
}

module.exports = { fixPathSeparators, persist, error, info, success, warn };
