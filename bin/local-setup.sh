#!/usr/bin/env bash
#
# Runs all local setup scripts.
#
set -o errexit
set -o nounset
set -o pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )"

# downloads all dependencies for backend and frontend
# needed for rebase: yes
yarn install

# ensure all docker containers are up
# needed for rebase: no
docker compose up -d

# spins up docker containers for backend
# needed for rebase: yes
./reset-local-database.sh

# creates s3 bucket for hosting content
# needed for rebase: no
./setup-local-s3-bucket.sh
