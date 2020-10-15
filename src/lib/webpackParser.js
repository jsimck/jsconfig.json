const path = require('path');
const fs = require('fs');

const MOCK_ARGS = [process?.env?.NODE_ENV ?? 'development', ''];

/**
 * Extracts paths from webpack resolve.alias config.
 *
 * @param {{resolve: {alias: {object}}}} config
 * @param {string} baseUrl
 * @return {object}
 */
function extractPaths(config, baseUrl) {
  const aliases = config?.resolve?.alias;

  if (!aliases) {
    return null;
  }

  return Object.keys(aliases).reduce((acc, cur) => {
    const pathKey = `${cur}/*`;
    const pathVal = `${path.relative(baseUrl, aliases[cur])}/*`;

    if (acc[pathKey] && acc[pathKey].includes(pathVal)) {
      acc[pathKey].push([pathVal]);
    } else {
      acc[pathKey] = [pathVal];
    }

    return acc;
  }, {});
}

/**
 * Parses webpack config and returns viable vscode jsconfig.json
 * options extracted from the given webpack config.
 *
 * @param {string} configPath
 * @param {string} [baseUrl='.']
 * @return {Promise<object>} extracted webpack configs converted to jsconfig.json format
 */
async function parseWebpackConfig(configPath, baseUrl = './') {
  const fullConfigPath =
    configPath && configPath.endsWith('.js')
      ? configPath
      : path.resolve(baseUrl, 'webpack.config.js');

  if (!fs.existsSync(fullConfigPath)) {
    return {};
  }

  const config = require(fullConfigPath);
  if (!['object', 'function'].includes(typeof config)) {
    console.warn(
      `Unable to parse given webpack config: ${fullConfigPath}, it must be either object, function or a promise.`
    );

    return {};
  }

  const parsedConfig =
    typeof config === 'object'
      ? await Promise.resolve(config)
      : config(...MOCK_ARGS);

  if (!parsedConfig || typeof parsedConfig !== 'object') {
    console.warn('Unknown error occured while parsing webpack config.');

    return {};
  }

  const paths = Array.isArray(parsedConfig)
    ? parsedConfig.reduce(
        (acc, currentConfig) => ({
          ...acc,
          ...extractPaths(currentConfig, baseUrl),
        }),
        {}
      )
    : extractPaths(parsedConfig, baseUrl);

  return paths !== null
    ? {
        compilerOptions: {
          paths,
          baseUrl,
        },
      }
    : {};
}

module.exports = {
  parseWebpackConfig,
};
