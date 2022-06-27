#!/usr/bin/env bash
#
# Pushes API docker image. Used in build pipeline.
# Requires ECR auth.
#
# Usage
#
#   ./docker/push.sh <registry uri> <image tag> <tag as latest>
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

# Push the image
full_image_name=${docker_registry}:${image_tag}
echo "Pushing image '${full_image_name}'"
docker push ${full_image_name}

# Push latest tag if specified
if [[ ${tag_as_latest} == 'true' ]] ; then
  echo "Pushing image '${docker_registry}:latest'"
  docker push ${docker_registry}:latest
fi
