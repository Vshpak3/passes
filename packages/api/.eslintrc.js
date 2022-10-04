module.exports = {
  extends: '../../.eslintrc.js',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['plugin:jest/recommended'],
  rules: {
    '@typescript-eslint/no-floating-promises': ['error', { 'ignoreIIFE': true }],
    'no-console': 'error',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
  }
}
