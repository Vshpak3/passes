#!/usr/bin/env bash
#
# Checks OpenAPI specs:
#   1. Checks that generated files were updated
#   2. Checks that api changes are backwards compatible
#
# TODO: script not ready yet, currently compares to itself
#
set -o errexit
set -o nounset
set -o pipefail

readonly output_path=src/openapi/specs

# Generate new OpenAPI spec
# yarn install
# yarn workspace @passes/api generate-openapi-spec openapi-new.json
echo -e '\n--------------------------------------------------------------------------------\n'

# Compare new to old
changes=$(yarn workspace @passes/api openapi-diff ${output_path}/openapi-new.json ${output_path}/openapi-new.json \
          | tail -n +2 \
          || true)

# Check if there were any changes
if [[ -z "${changes}" ]] ; then
  echo 'There were no changes'
  exit 0
fi

# Fail if breaking changes were detected
if $(jq -r '.breakingDifferencesFound' <<<${changes}) ; then
  echo -e 'Found breaking changes!!!\n'
  jq '.breakingDifferences' <<<${changes}
  exit 1
fi

# Log all changes
echo -e 'All changes are backwards compatible:\n'
jq '.nonBreakingDifferences' <<<${changes}
echo -e '\nExiting with success'
exit 0
