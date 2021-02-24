module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        semi: true,
        singleQuote: true,
      },
    ],
  },
};
