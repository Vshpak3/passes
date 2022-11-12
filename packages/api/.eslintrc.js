module.exports = {
  extends: '../../.eslintrc.js',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['plugin:jest/recommended'],
  // The TS import in this file causes issues with eslint
  ignorePatterns: ['generate-shared-constants.ts'],
  rules: {
    '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],
    'no-console': 'error',
    'no-magic-numbers': ['error', { ignore: [0, 1, 2, 100, 1000] }],
    quotes: ['error', 'single', { avoidEscape: true }],
  },
}
