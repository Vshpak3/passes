#!/usr/bin/env bash
#
# Resets all database state.
#
set -o errexit
set -o nounset
set -o pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )"/..

function log() {
  echo -e "\n$1\n"
}

log 'Spinning down docker containers and associated volumes'
docker compose down --volumes

log 'Spinning back up docker containers'
docker compose up --detach

log 'Removing all ORM metadata'
git clean -xfd packages/api/src/database/

log 'Generating schema migrations'
yarn workspace @moment/api migration:create

log 'Applying schema migrations'
yarn workspace @moment/api migration:up

log 'Done!'
