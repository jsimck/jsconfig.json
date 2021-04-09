import path from 'path';
import fs from 'fs';

const DependencyTemplateMap = Object.freeze({
  nextjs: ['next'],
  react: ['react', 'react-dom', 'react-scripts']
});

/**
 * Looks at package.json dependencies and tries to match corresponding
 * template based on dependencies defined in DependencyTemplateMap.
 *
 * @param {object} pkgJson Parsed package.json.
 * @return {string|null} Matched template name or null.
 */
function extractTemplate(pkgJson) {
  const { dependencies } = pkgJson || {};

  if (!dependencies) {
    return null;
  }

  for (let dependency in dependencies) {
    for (let template in DependencyTemplateMap) {
      if (DependencyTemplateMap[template].includes(dependency)) {
        return template;
      }
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

export { templateParser, extractTemplate, DependencyTemplateMap };
