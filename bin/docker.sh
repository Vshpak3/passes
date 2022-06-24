#!/usr/bin/env bash
#
# Builds API docker image.
#
set -o errexit
set -o nounset
set -o pipefail

readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..
cd ${root}

docker_registry=todo
version=$(git rev-parse --short HEAD)

DOCKER_BUILDKIT=0 docker build --target release -t ${docker_registry}:${version} -f 'docker/api.Dockerfile' .
