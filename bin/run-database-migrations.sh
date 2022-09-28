#!/usr/bin/env sh
#
# Used in code pipeline to run database migrations.
# Script must be sh since bash is not installed.
#
set -o errexit
set -o nounset
set -o pipefail

cd "$(dirname "${0}")"/..

function log() {
  echo "\n${1}\n"
}

log 'Applying schema migrations'

yarn workspace @passes/api migration:up

log 'Done!'
