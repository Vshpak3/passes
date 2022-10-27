#!/usr/bin/env bash
#
# Builds and pushes backend docker image. Used in build/deploy pipeline.
#
# Will skip building (dedup) if the image already exists in ECR. Requires ECR
# auth for dedup.
#
# Usage
#
#   ./docker/build.sh <registry uri> <image tag> <dedup build> <tag as this>
#
# If arguments are not provided defaults are used.
#
set -o errexit
set -o nounset
set -o pipefail

function log() {
  echo -e "$1\n"
}

log "Build started on $(date)"

# Defaults
readonly default_registry_uri=908484362543.dkr.ecr.us-east-1.amazonaws.com/passes-monolith
readonly default_image_tag=$(git rev-parse --short HEAD 2> /dev/null || true)
readonly default_dedup_build=false

# Use arguments or default
readonly registry_uri=${1:-${default_registry_uri}}
readonly image_tag=${2:-${default_image_tag}}
readonly dedup_build=${3:-${default_dedup_build}}
readonly tag_as_this=${4:-}

# Derived image names
readonly full_image_name=${registry_uri}:${image_tag}
readonly tagged_image_name=${registry_uri}:${tag_as_this}

# Function to tag a docker image
function tag_image() {
  local source_name=${1}
  local target_name=${2}
  log "Tagging and pushing image '${target_name}'"
  docker tag ${source_name} ${target_name}
  docker push ${target_name}
  echo
}

# Check if we should skip the docker build if the image already exists
if ${dedup_build} && aws ecr list-images --repository-name $(cut -d/ -f2 <<<${registry_uri}) \
      | grep -q "\"imageTag\": \"${image_tag}\"" ; then
  log "Image with tag '${image_tag}' already exists; skipping build"

  # Pull the image and tag the image if specified
  if [[ -n ${tag_as_this} ]] ; then
    log "Pulling image '${full_image_name}'"
    docker pull ${full_image_name}
    echo
    tag_image ${full_image_name} ${tagged_image_name}
    log 'Finished pushing images'
  fi

  exit
fi

# Download cache image
if [[ -n ${tag_as_this} ]] ; then
  log "Pulling image '${tagged_image_name}' to be used as the cache image"
  docker pull ${tagged_image_name} || true
  echo
fi

# Determine which platform to build on depending on if the image name is suffixed
platform=linux/arm64
if [[ ${image_tag} == *-amd64 ]] ; then
  log 'Building using AMD64'
  platform=linux/amd64
fi

# Ensure we use run the docker build from the repo root
cd "$( dirname "${BASH_SOURCE[0]}" )"/..

# Log the docker version
docker --version
echo

# Build the image
log "Building image '${full_image_name}'"
DOCKER_BUILDKIT=1 docker build \
  --platform ${platform} \
  --target release \
  --tag ${full_image_name} \
  --cache-from ${tagged_image_name} \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -f 'docker/api.Dockerfile' .
echo
log 'Finished building image'
log "Pushing image '${full_image_name}'"
docker push ${full_image_name}
echo

# Tag and push tag if specified
if [[ -n ${tag_as_this} ]] ; then
  tag_image ${full_image_name} ${tagged_image_name}
fi

log 'Finished pushing images'
