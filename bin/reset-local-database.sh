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

readonly input=${1:-}

if [[ ${input} == 'full' ]] ; then
  log 'Spinning down docker containers and associated volumes'
  docker compose down --volumes

  log 'Spinning back up docker containers'
  docker compose up --detach

  echo 'Waiting for MySQL docker container to be ready'
  while ! MYSQL_PWD=root mysqladmin ping -h 127.0.0.1 -P 3306 -u root --silent ; do
      sleep 1
  done
fi

log 'Removing all ORM metadata'
git clean -xfd packages/api/src/database/

log 'Generating schema migrations'
yarn workspace @passes/api migration:create

log 'Applying schema migrations'
yarn workspace @passes/api migration:up

log 'Done!'
