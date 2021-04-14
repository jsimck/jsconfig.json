<br>
<h1 align="center">jsconfig.json</h1>
<p align="center">
    Automatically generates <b>jsconfig.json</b> for your vscode workspace with optional support for custom absolute <b>path aliases</b> used for import/export extracted from webpack config resolve alias option.
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

By default the `jsconfig.json` is generated in **current working directory** (this is also where the script looks for existence of `webpack.config.js` file in order to try to extract path aliases). This can be changed by providing path to custom working directory as a first argument of the cli (`npx jsconfig.json ~/Workspace/my-awesome-project`).

### Templates

There are few predefined jsconfig.json templates, that can be selected using `-t, --template` argument. There are currently following templates to choose from: `default` (default option), `nextjs`, `react`, `vuejs` and `node`.

### Additional CLI options

There are additional CLI options which allows you to further overwrite additional defaults or even provide custom `--baseUrl` and `--webpackConfigPath` that are used to generate correct paths to aliases. For more options run:

```console
npx jsconfig.json --help
```
```console
Usage: npx jsconfig.json <srcPath> [options]

Options:
      --help                    Show help                                                     [boolean]
      --version                 Show version number                                           [boolean]
  -t, --template                Base jsconfig.json template
                          [choices: "default", "nextjs", "react", "vuejs", "node"] [default: "default"]
  -b, --baseUrl                 Custom base url used for paths generation       [string] [default: "."]
  -c, --webpackConfig           Custom path to webpack.config.js                               [string]
  -a, --target                  Specifies which default library (lib.d.ts) to use
    [string] [choices: "es3", "es5", "es6", "es2015", "es2016", "es2017", "es2018", "es2019", "es2020",
                                                                          "esnext"] [default: "es2020"]
  -m, --module                  Specifies the module system, when generating module code
    [string] [choices: "amd", "commonJS", "es2015", "es6", "esnext", "none", "system", "umd"] [default:
                                                                                              "es2015"]
  -r, --moduleResolution        Specifies how modules are resolved for imports
                                                [string] [choices: "node", "classic"] [default: "node"]
  -e, --experimentalDecorators  Enables experimental support for proposed ES decorators       [boolean]
  -s, --syntheticImports        Allow default imports from modules with no default export. This does
                                not affect code emit, just type checking.                     [boolean]
```

### Support
- Node.js >= **10.x** (**>= 14.x** for development)
- npm >= **5.2**


## Contributions

Contributions of any kind are very welcome!

This repository uses **conventional commits** in order to correctly generate CHANGELOG and release automatically. This means that all commits should follow correct form defined in the conventional commits specification. To make this process easier (and since there's pre-commit hook to validate commit messages. which won't let you commit invalid messages) you can run commit wizard using:

```
npm run commit
```

Which will take you through the process of generating correct format of the commit message.

### Build & dev

The source files are transpiled for production package with babel to support nodeJS versions from v10+ (since I'm too lazy to actually write the code so it works on node 10+ without any modifications...). To build source files run `npm run build`.

To run cli in development you can use `npm run dev` to fires up nodemon which watches changes over the source files. Don't forget to provide custom working directory in this case, since by default it would start overwriting `jsconfig.json` located in the root of this repository (I'll probably provide more straightforward and logical solution in the future to mitigate this issue).

### Tests

Tests are written using [jest framework](https://jestjs.io/). To run them use either `npm run test` or `npm run test:watch` to run test runner in watch mode.
