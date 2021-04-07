import path from 'path';
import fs from 'fs';

const MOCK_ARGS = [process?.env?.NODE_ENV ?? 'development', ''];

/**
 * Generates path aliases from provided webpack config.
 *
 * @param {object} webpackConf Webpack config.
 * @param {object} config Config object.
 * @return {object<string, Array<string>>} Object with
 *         defined path aliases.
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

/**
 * Extracts path aliases from provided webpack config.
 *
 * @param {object} webpackConf Webpack config.
 * @param {object} params Params object.
 * @param {object} config Config object.
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

export { webpackParser, parseWebpackConf, extractPaths };
