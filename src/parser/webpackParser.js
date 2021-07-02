const path = require('path');
const fs = require('fs');

const MOCK_ARGS = [process.env.NODE_ENV || 'development', ''];

/**
 * Generates path aliases from provided webpack config.
 *
 * @param {Object} webpackConf Webpack config.
 * @param {Object} config Config object.
 * @return {Object} Paths object and baseUrl.
 */
function extractPaths(webpackConf, config) {
  const baseUrl =
    (config.compilerOptions && config.compilerOptions.baseUrl) || '.';
  const { alias } = (webpackConf && webpackConf.resolve) || {};

  if (!baseUrl || !alias || Object.keys(alias).length === 0) {
    return {};
  }

  const paths = Object.keys(alias).reduce((acc, cur) => {
    const pathKey = path.join(cur, '*');
    const pathVal = path.relative(baseUrl, path.join(alias[cur], '*'));

    acc[pathKey] = [pathVal];

    return acc;
  }, {});

  return { paths, baseUrl };
}

/**
 * Extracts path aliases from provided webpack config.
 *
 * @param {Object} webpackConf Webpack config.
 * @param {Object} params Params object.
 * @param {Object} config Config object.
 * @return {Promise<{ params, config }>} Modified params and config objects.
 */
async function parseWebpackConf(webpackConf, params, config) {
  const { webpackConfigLocation } = params;

  if (!webpackConf || !['object', 'function'].includes(typeof webpackConf)) {
    throw new TypeError(
      `Unable to parse given webpack config: ${webpackConfigLocation}, it must be either object, function or a promise.`
    );
  }

  let parsedWebpackConf =
    typeof webpackConf === 'object'
      ? await Promise.resolve(webpackConf)
      : webpackConf(...MOCK_ARGS);

  // ES6 modules fix
  if (parsedWebpackConf.default) {
    parsedWebpackConf = parsedWebpackConf.default;
  }

  if (!parsedWebpackConf || typeof parsedWebpackConf !== 'object') {
    throw new Error(
      `Unknown error occurred while parsing webpack config at '${webpackConfigLocation}'`
    );
  }

  const { paths, baseUrl } = Array.isArray(parsedWebpackConf)
    ? parsedWebpackConf.reduce((acc, currentConfig) => {
        const extractedPaths = extractPaths(currentConfig, config);

        return {
          paths: {
            ...acc.paths,
            ...extractedPaths.paths
          },
          baseUrl: extractedPaths.baseUrl
        };
      }, {})
    : extractPaths(parsedWebpackConf, config);

  if (!paths || Object.keys(paths).length === 0) {
    return { params, config };
  }

  return {
    params,
    config: {
      ...config,
      compilerOptions: {
        ...config.compilerOptions,
        baseUrl,
        paths
      }
    }
  };
}

/**
 * Parses webpack config creating path aliases in the jsconfig.json
 * if any are defined within the webpack config.
 *
 * @param {{ params, config }} args Object with params and config objects,
 *        used to carry config and params across parsers.
 * @return {Promise<{ params, config }>} Modified params and config objects.
 */
async function webpackParser({ params, config }) {
  const { webpackConfigLocation } = params;

  if (!webpackConfigLocation) {
    throw new TypeError(
      `Webpack config location: ${webpackConfigLocation} is invalid.`
    );
  }

  const fullConfigPath = path.resolve(webpackConfigLocation);

  if (!fs.existsSync(fullConfigPath)) {
    return { params, config };
  }

  return parseWebpackConf(require(fullConfigPath), params, config);
}

webpackParser.parserName = 'webpack parser';

module.exports = { webpackParser, parseWebpackConf, extractPaths };
