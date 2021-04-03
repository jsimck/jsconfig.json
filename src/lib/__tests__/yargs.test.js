const { CLIArgs } = require('../yargs');

describe('CLIArgs', () => {
  it('should match snapshot', () => {
    expect(CLIArgs).toMatchInlineSnapshot(`
      Object {
        "BASE_URL": "baseUrl",
        "EXPERIMENTAL_DECORATORS": "experimentalDecorators",
        "MODULE": "module",
        "MODULE_RESOLUTION": "moduleResolution",
        "SYNTHETIC_IMPORTS": "syntheticImports",
        "TARGET": "target",
        "TEMPLATE": "template",
        "WEBPACK_CONFIG": "webpackConfig",
      }
    `);
  });
});
