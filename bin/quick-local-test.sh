#!/usr/bin/env bash
#
# Quick script for testing code locally
#
set -o errexit
set -o nounset
set -o pipefail

yarn workspace @passes/api prettier:fix &
yarn workspace @passes/ui prettier:fix &

yarn workspace @passes/api lint:fix &
yarn workspace @passes/ui lint:fix &

yarn workspace @passes/api ts:check &
yarn workspace @passes/ui ts:check &

wait

echo -e '\nAll good'
