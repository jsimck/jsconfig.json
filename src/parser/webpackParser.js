const path = require('path');
const fs = require('fs');
const { info } = require('../lib/utils');

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

    if (acc[pathKey]?.includes?.(pathVal)) {
      acc[pathKey].push([pathVal]);
    } else {
      acc[pathKey] = [pathVal];
    }

    return acc;
  }, {});
}

/**
 * Parses webpack config creating path aliases if defined.
 *
 * @param {{ params, config }} args Object with params and config objects.
 * @return {Promise<{ params, config }>} Adjusted object with params and config objects.
 */
async function webpackParser({ params, config }) {
  const { baseUrl } = config;
  const { webpackConfigLocation } = params;
  const fullConfigPath = path.resolve(webpackConfigLocation);

  if (!fs.existsSync(fullConfigPath)) {
    return { params, config };
  }

  const webpackConfig = require(fullConfigPath);

  if (!['object', 'function'].includes(typeof webpackConfig)) {
    throw new TypeError(
      `Unable to parse given webpack config: ${fullConfigPath}, it must be either object, function or a promise.`
    );
  }

  const parsedConfig =
    typeof webpackConfig === 'object'
      ? await Promise.resolve(webpackConfig)
      : config(...MOCK_ARGS);

  if (!parsedConfig || typeof parsedConfig !== 'object') {
    throw new Error(
      `Unknown error occurred while parsing webpack config at '${fullConfigPath}'`
    );
  }

  info(`Parsing webpack config at '${fullConfigPath}'...`);
  const paths = Array.isArray(parsedConfig)
    ? parsedConfig.reduce(
        (acc, currentConfig) => ({
          ...acc,
          ...extractPaths(currentConfig, baseUrl),
        }),
        {}
      )
    : extractPaths(parsedConfig, baseUrl);

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
