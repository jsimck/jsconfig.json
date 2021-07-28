<br>
<h1 align="center">jsconfig.json</h1>
<p align="center">
    Automatically generates <b>jsconfig.json</b> for your vscode workspace with optional support for custom absolute <b>path aliases</b> used for import/export extracted from webpack config resolve alias option or node imports subpath patterns defined in package.json.
</p>
<p align="center">
    <a href="https://github.com/jsimck/jsconfig.json/actions/workflows/ci.yml">
        <img alt="ci" src="https://github.com/jsimck/jsconfig.json/actions/workflows/ci.yml/badge.svg?branch=main">
    </a>
    <a href="https://conventionalcommits.org">
        <img alt="Conventional Commits" src="https://img.shields.io/badge/  Conventional%20Commits-1.0.0-yellow.svg">
    </a>
    <a href="https://github.com/prettier/prettier">
        <img alt="Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
    </a>
</p>

## Quick start
```console
npx jsconfig.json
```

By default the `jsconfig.json` is generated in **current working directory** (this is also where the script looks for existence of `webpack.config.js` or `package.json` file in order to try to extract path aliases).

This can be changed by providing path to custom working directory as a **first argument** of the cli (`npx jsconfig.json ~/Workspace/my-project`).

### Templates

There are few predefined jsconfig.json templates, that can be selected using `-t, --template` argument to help bootstrap the correct environment (`default` [default option], `nextjs`, `react`, `vuejs` and `node`).

```console
npx jsconfig.json --template=nextjs
```

### Additional CLI options

These allow you to further overwrite additional defaults or even provide custom `--baseUrl` and `--webpackConfigPath` that are used to generate correct paths to aliases. Lastly `--output` is used to define custom output directory for generated jsconfig.json file (this will not change the path aliases generation in any way). For more options run:

```console
npx jsconfig.json --help
```

```console
Usage: npx jsconfig.json <srcPath> [options]

Options:
      --help                    Show help                                           [boolean]
      --version                 Show version number                                 [boolean]
  -o, --output                  Optional custom output directory for generated jsconfig.json
                                file                                                 [string]
  -t, --template                Base jsconfig.json template
                [choices: "default", "nextjs", "react", "vuejs", "node"] [default: "default"]
  -b, --baseUrl                 Custom base url used for paths generation            [string]
  -c, --webpackConfig           Custom path to webpack.config.js                     [string]
  -a, --target                  Specifies which default library (lib.d.ts) to use
    [string] [choices: "es3", "es5", "es6", "es2015", "es2016", "es2017", "es2018", "es2019",
                                                      "es2020", "esnext"] [default: "es2020"]
  -m, --module                  Specifies the module system, when generating module code
    [string] [choices: "amd", "commonJS", "es2015", "es6", "esnext", "none", "system", "umd"]
                                                                          [default: "es2015"]
  -r, --moduleResolution        Specifies how modules are resolved for imports
                                      [string] [choices: "node", "classic"] [default: "node"]
  -e, --experimentalDecorators  Enables experimental support for proposed ES decorators
                                                                                    [boolean]
  -s, --syntheticImports        Allow default imports from modules with no default export.
                                This does not affect code emit, just type checking. [boolean]
```

### Support
- Node.js >= **12.x**


## Contributions

Contributions of any kind are very welcome!

This repository uses **conventional commits** in order to correctly generate CHANGELOG and release automatically. This means that all commits should follow correct form defined in the conventional commits specification. To make this process easier (and since there's pre-commit hook to validate commit messages. which won't let you commit invalid messages) you can run commit wizard using:

```
npm run commit
```

Which will take you through the process of generating correct format of the commit message.

### Development

To run cli in development you can use `npm run dev` to fires up nodemon which watches changes over the source files. By default the result is written to tmp/jsconfig.json when using nodemon (this looks int the root directory of the repository for webpack configs, you can provide custom webpack config while developing using CLI options `npm run dev -- --webpackConfig=/tmp/custom.webpack.test.config.js`).

### Tests

Tests are written using [jest framework](https://jestjs.io/). To run them use either `npm run test` or `npm run test:unit`, `npm run test e2e` to run each set of tests separately.
