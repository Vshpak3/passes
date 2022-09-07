#!/usr/bin/env bash
#
# Checks OpenAPI specs:
#   1. Checks that generated files were updated
#   2. Checks that api changes are backwards compatible
#
set -o errexit
set -o nounset
set -o pipefail

readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..

yarn install
yarn workspace @passes/api generate-openapi-spec
echo "TODO"
