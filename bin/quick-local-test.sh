#!/usr/bin/env bash
#
# Quick script for testing code locally
#
set -o errexit
set -o nounset
set -o pipefail

function log() {
  echo -e "\n${1}\n"
}

log 'Running prettier'

yarn workspace @passes/api prettier:fix &
yarn workspace @passes/ui prettier:fix &

wait

log 'Running lint and typescript checks'

yarn workspace @passes/api lint:fix &
yarn workspace @passes/ui lint:fix &

yarn workspace @passes/api ts:check &
yarn workspace @passes/ui ts:check &

wait

log 'All good'
