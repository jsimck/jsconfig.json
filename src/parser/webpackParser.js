import path from 'path';
import fs from 'fs';

const MOCK_ARGS = [process?.env?.NODE_ENV ?? 'development', ''];

/**
 * Extracts paths from webpack resolve.alias config.
 *
 * @param {{resolve: {alias: {object}}}} config
 * @return {object}
 */
function extractPaths(webpackConf, config) {
  const { baseUrl } = config?.compilerOptions ?? {};
  const { alias } = webpackConf?.resolve ?? {};

  if (!baseUrl || !alias || Object.keys(alias).length === 0) {
    return null;
  }

  return Object.keys(alias).reduce((acc, cur) => {
    const pathKey = `${cur}/*`;
    const pathVal = `${path.relative(baseUrl, alias[cur])}/*`;

    acc[pathKey] = [pathVal];

    return acc;
  }, {});
}

async function parseWebpackConf(webpackConf, params, config) {
  const { webpackConfigLocation } = params;

  if (!webpackConf || !['object', 'function'].includes(typeof webpackConf)) {
    throw new TypeError(
      `Unable to parse given webpack config: ${webpackConfigLocation}, it must be either object, function or a promise.`
    );
  }

  const parsedWebpackConf =
    typeof webpackConf === 'object'
      ? await Promise.resolve(webpackConf)
      : webpackConf(...MOCK_ARGS);

  if (!parsedWebpackConf || typeof parsedWebpackConf !== 'object') {
    throw new Error(
      `Unknown error occurred while parsing webpack config at '${webpackConfigLocation}'`
    );
  }

  const paths = Array.isArray(parsedWebpackConf)
    ? parsedWebpackConf.reduce(
        (acc, currentConfig) => ({
          ...acc,
          ...extractPaths(currentConfig, config)
        }),
        {}
      )
    : extractPaths(parsedWebpackConf, config);

  const result = {
    params,
    config: {
      ...config,
      compilerOptions: {
        ...config.compilerOptions
      }
    }
  };

  if (paths && Object.keys(paths).length > 0) {
    result.config.compilerOptions.paths = paths;
  }

  return result;
}

/**
 * Parses webpack config creating path aliases if defined.
 *
 * @param {{ params, config }} args Object with params and config objects.
 * @return {Promise<{ params, config }>} Adjusted object with params and config objects.
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

export { webpackParser, parseWebpackConf, extractPaths };
