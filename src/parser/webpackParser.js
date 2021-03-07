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
 * Parses webpack config, fills up paths and baseUrl if defined.
 *
 * @param {{ params, config }} args Object with params and config objects.
 * @return {Promise<{ params, config }>} Adjusted object with params and config objects.
 */
async function webpackParser({ params, config }) {
  const { webpackConfigLocation, baseUrl } = params;
  const fullConfigPath = path.resolve(webpackConfigLocation);

  if (!fs.existsSync(fullConfigPath)) {
    return { params, config };
  }

  const webpackConfig = require(fullConfigPath);

  if (!['object', 'function'].includes(typeof webpackConfig)) {
    console.warn(
      `Unable to parse given webpack config: ${fullConfigPath}, it must be either object, function or a promise.`
    );

    return { params, config };
  }

  const parsedConfig =
    typeof webpackConfig === 'object'
      ? await Promise.resolve(webpackConfig)
      : config(...MOCK_ARGS);

  if (!parsedConfig || typeof parsedConfig !== 'object') {
    console.warn('Unknown error occurred while parsing webpack config.');

    return { params, config };
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

  if (params === null) {
    return { params, config };
  }

  return {
    params,
    config: {
      ...config,
      compilerOptions: {
        paths,
        ...config.compilerOptions,
      },
    },
  };
}

module.exports = {
  webpackParser,
};
