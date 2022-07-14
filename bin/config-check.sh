#!/usr/bin/env bash
#
# Very quick check to ensure that each environment's config has the same keys.
#
set -o errexit
set -o nounset
set -o pipefail

readonly env_filepath=packages/api/src/config/

readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..

function get_keys() {
  local filename=${1}
  cat ${root}/${env_filepath}/${filename} | tr -d ' ' | cut -d= -f1 | cut -d# -f1 | sed '/^$/d'
}

echo "Dev config keys:"
dev=$(get_keys .env.dev)
echo "${dev}" | sed 's/^/  /'

echo "Stage config keys:"
stage=$(get_keys .env.stage)
echo "${stage}" | sed 's/^/  /'

echo "Prod config keys:"
prod=$(get_keys .env.prod)
echo "${prod}" | sed 's/^/  /'

if [[ "${stage}" != "${dev}" ]] ; then
  echo "Stage config keys do not match dev config keys"
  exit 1
fi

if [[ "${prod}" != "${dev}" ]] ; then
  echo "Prod config keys do not match dev config keys"
  exit 1
fi
