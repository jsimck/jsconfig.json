module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
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
        useTabs: false,
        tabWidth: 2,
      },
    ],
  },
};
