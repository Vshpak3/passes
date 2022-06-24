#!/usr/bin/env bash
#
# Builds API docker image.
#
# Usage
#
#   ./bin/docker_build.sh <registry uri> <image tag> <tag as latest>
#
# If not arguments are provided defaults are used.
#
set -o errexit
set -o nounset
set -o pipefail

echo "Build started on $(date)"

# Defaults
readonly default_docker_registry=626392801904.dkr.ecr.us-east-2.amazonaws.com/moment-api-dev
readonly default_image_tag=$(git rev-parse --short HEAD)
readonly default_tag_as_latest=false

# Use arguments or default
readonly docker_registry=${1:-${default_docker_registry}}
readonly image_tag=${2:-${default_image_tag}}
readonly tag_as_latest=${3:-${default_tag_as_latest}}

# Ensure we use root
readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..
cd ${root}

# Build the image
full_image_name=${docker_registry}:${image_tag}
echo "Building image '${full_image_name}'"
DOCKER_BUILDKIT=0 docker build --target release --tag ${full_image_name} -f 'docker/api.Dockerfile' .

# Tag as latest if specified
if [[ ${tag_as_latest} == "true" ]] ; then
  echo "Tagging image as latest"
  docker tag ${full_image_name} ${docker_registry}:latest
fi
