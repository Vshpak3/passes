#!/usr/bin/env bash
#
# Ensures we only deploy Vercel when files under `packages/ui/` are modified.
# This script is specified in the Vercel settings page.
#

echo -e "Dead Code:\n"
yarn workspace @passes/ui ts-unused-exports tsconfig.json | grep -v /src/pages/
echo

echo -e "Unused Dependencies:\n"
readonly skip_packages=(
  @types/prop-types
  @types/react-dom
  @typescript-eslint/eslint-plugin
  @typescript-eslint/parser
  autoprefixer
  depcheck
  eslint-config-prettier
  eslint-plugin-eslint-comments
  eslint-plugin-import
  eslint-plugin-jsx-a11y
  eslint-plugin-prettier
  eslint-plugin-promise
  eslint-plugin-regexp
  eslint-plugin-simple-import-sort
  eslint-plugin-sonarjs
  prettier-plugin-tailwindcss
  ts-unused-exports
)

yarn workspace @passes/ui depcheck \
  --skip-missing true \
  --ignores $(echo ${skip_packages[@]} | tr ' ' ',')
