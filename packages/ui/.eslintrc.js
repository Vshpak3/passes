module.exports = {
  extends: '../../.eslintrc.js',
  extends: [
    'next/core-web-vitals',
    // 'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    // 'plugin:react/recommended',
  ],
  overrides: [
    {
      files: ['./src/**/*'],
      rules: {
        'sonarjs/cognitive-complexity': 'off',
        'sonarjs/no-duplicate-string': 'off',
      },
    },
  ],
}
