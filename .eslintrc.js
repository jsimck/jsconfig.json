module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    'jest/globals': true
  },
  plugins: ['jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12
  },
  rules: {
    'jest/expect-expect': 2,
    'jest/no-duplicate-hooks': 2,
    'jest/prefer-called-with': 2,
    'jest/prefer-hooks-on-top': 2,
    'jest/require-top-level-describe': 2,
    'jest/prefer-todo': 2,
    'jest/prefer-spy-on': 2,
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        semi: true,
        singleQuote: true,
        useTabs: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto'
      }
    ]
  }
};
