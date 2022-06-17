// Workaround for https://github.com/eslint/eslint/issues/3458
// require('@rushstack/eslint-patch/modern-module-resolution ')

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  ignorePatterns: ['.eslintrc.js'],
}
