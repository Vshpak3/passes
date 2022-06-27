#!/usr/bin/env bash
#
# Runs API docker image. NOT used in build pipeline.
#
# Usage
#
#   ./docker/run.sh <registry uri> <image tag>
#
# If not arguments are provided defaults are used.
#
set -o errexit
set -o nounset
set -o pipefail

# Defaults
readonly default_docker_registry=626392801904.dkr.ecr.us-east-2.amazonaws.com/moment-api-dev
readonly default_image_tag=$(git rev-parse --short HEAD)

# Use arguments or default
readonly docker_registry=${1:-${default_docker_registry}}
readonly image_tag=${2:-${default_image_tag}}

# Run the image
docker run \
    --rm \
    --init \
    -p '127.0.0.1:3001:3001/tcp' \
    ${docker_registry}:${image_tag}
