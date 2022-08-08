#!/usr/bin/env sh
#
# Used in code pipeline, database migration step.
#
set -o errexit
set -o nounset
set -o pipefail

cd "$(dirname "${0}")"/..

function log() {
  echo "\n$1\n"
}

log 'Generating schema migrations'
yarn workspace @passes/api migration:create

log 'Applying schema migrations'
yarn workspace @passes/api migration:up

log 'Done!'
