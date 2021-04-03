# jsconfig.json

Small tool which automatically generates `jsconfig.json`, used for vscode workspace configuration, with some defaults.

Additionally if you use webpack aliases in your project, the tool takes care of automatically generating correct
paths based on those aliases and provided base folder argument, which enables correct autocomplete for absolute paths.

## Quick start
```
npx jsconfig.json .
```

Where the first argument should correspond to the location of your source files. One that contains actual source code, since the path aliases are generated based on this path. Most of the time it will be something like this `.`, `./src`, `./lib`...

For other CLI options, which let's you override some defaults and define custom webpack config path, run:

```
npx jsconfig.json --help
```
```
Usage: npx jsconfig.json <baseFolder> [options]

Options:
      --help                    Show help                                                            [boolean]
      --version                 Show version number                                                  [boolean]
  -c, --webpackConfig           Custom path to webpack.config.js                                      [string]
  -t, --target                  Specifies which default library (lib.d.ts) to use
           [string] [choices: "es3", "es5", "es6", "es2015", "es2016", "es2017", "es2018", "es2019", "es2020",
                                                                                 "esnext"] [default: "es2020"]
  -m, --module                  Specifies the module system, when generating module code
           [string] [choices: "amd", "commonJS", "es2015", "es6", "esnext", "none", "system", "umd"] [default:
                                                                                                     "es2015"]
  -r, --moduleResolution        Specifies how modules are resolved for imports
                                                       [string] [choices: "node", "classic"] [default: "node"]
  -e, --experimentalDecorators  Enables experimental support for proposed ES decorators              [boolean]
  -s, --syntheticImports        Allow default imports from modules with no default export. This does not
                                affect code emit, just type checking.                                [boolean]
```

## Support
- Node.js >= **10.x**
- npm >= **5.2**
