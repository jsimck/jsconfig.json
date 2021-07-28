const path = require('path');
const fs = require('fs');

function importsToPaths(imports, config) {
  return Object.keys(imports)
    .filter((cur) => typeof imports[cur] === 'string')
    .reduce((acc, cur) => {
      // Remove extensions
      const importPath = imports[cur].replace(/\*\.(\w+)?$/i, '*');

      // Build key-value object of paths
      if (acc[cur] && !~acc[cur].indexOf(importPath)) {
        acc[cur].push(importPath);
      } else {
        acc[cur] = [importPath];
      }

      return acc;
    }, (config && config.compilerOptions && config.compilerOptions.paths) || {});
}

/**
 * Extracts path aliases from package.json node imports field.
 * https://nodejs.org/api/packages.html#packages_subpath_imports
 *
 * @param {{ params, config }} args Object with params and config objects,
 *        used to carry config and params across parsers.
 * @return {Promise<{ params, config }>} Modified params and config objects.
 */
async function nodeImportsParser({ params, config }) {
  const { cwd } = params;
  const packageJsonPath = path.resolve(cwd, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return { params, config };
  }

  const pkgJson = require(packageJsonPath);

  if (!pkgJson || !pkgJson.imports || Object.keys(pkgJson.imports) === 0) {
    return { params, config };
  }

  const paths = importsToPaths(pkgJson.imports, config);

  if (!paths || Object.keys(paths).length === 0) {
    return { params, config };
  }

  return {
    params: {
      ...params
    },
    config: {
      ...config,
      compilerOptions: {
        ...config.compilerOptions,
        baseUrl: config.compilerOptions.baseUrl || '.',
        paths
      }
    }
  };
}

nodeImportsParser.parserName = 'node subpath imports parser';

module.exports = {
  importsToPaths,
  nodeImportsParser
};
