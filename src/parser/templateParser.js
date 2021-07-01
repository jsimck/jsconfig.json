const path = require('path');
const fs = require('fs');

const TemplateComparisonMap = Object.freeze({
  nextjs: {
    dependencies: ['next']
  },
  vuejs: {
    devDependencies: ['poi']
  },
  react: {
    dependencies: ['react', 'react-dom', 'react-scripts']
  }
});

/**
 * Searches for similarities in pkgJson based on comparison object.
 *
 * @param {object} pkgJson Package.json.
 * @param {object} comparisonObj Comparison object.
 * @return {null|string} Either null or template name in case of match.
 */
function comparePkgJson(pkgJson, comparisonObj) {
  for (let compareKey in comparisonObj) {
    if (!pkgJson[compareKey]) {
      continue;
    }

    for (let pkgKey in pkgJson[compareKey]) {
      if (comparisonObj[compareKey].indexOf(pkgKey) !== -1) {
        return true;
      }
    }
  }

  return null;
}

/**
 * Looks at package.json dependencies and tries to match corresponding
 * template based on dependencies defined in DependencyTemplateMap.
 *
 * @param {object} pkgJson Parsed package.json.
 * @return {string|null} Matched template name or null.
 */
function extractTemplate(pkgJson) {
  const { dependencies, devDependencies } = pkgJson || {};

  if (!dependencies && !devDependencies) {
    return null;
  }

  for (let template in TemplateComparisonMap) {
    if (comparePkgJson(pkgJson, TemplateComparisonMap[template])) {
      return template;
    }
  }

  return null;
}

/**
 * Tries to figure out the best default template to choose based on the CWD
 * package.json dependencies.
 *
 * @param {{ params, config }} args Object with params and config objects,
 *        used to carry config and params across parsers.
 * @return {Promise<{ params, config }>} Modified params and config objects.
 */
async function templateParser({ params, config }) {
  const { cwd } = params;
  const packageJsonPath = path.resolve(cwd, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return { params, config };
  }

  return {
    params: {
      ...params,
      template: extractTemplate(require(packageJsonPath)) || params.template
    },
    config
  };
}

templateParser.parserName = 'template parser';

module.exports = {
  comparePkgJson,
  templateParser,
  extractTemplate,
  TemplateComparisonMap
};
