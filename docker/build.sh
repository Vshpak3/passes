#!/usr/bin/env bash
#
# Builds and pushes backend docker image. Used in build/deploy pipeline.
#
# Will skip building (dedup) if the image already exists in ECR. Requires ECR
# auth for dedup.
#
# Usage
#
#   ./docker/build.sh <registry uri> <image tag> <dedup build>
#
# If not arguments are provided defaults are used.
#
set -o errexit
set -o nounset
set -o pipefail

echo "Build started on $(date)"

# Defaults
readonly default_registry_uri=626392801904.dkr.ecr.us-east-1.amazonaws.com/passes-monolith
readonly default_image_tag=$(git rev-parse --short HEAD 2> /dev/null || true)
readonly default_dedup_build=false

# Use arguments or default
readonly registry_uri=${1:-${default_registry_uri}}
readonly image_tag=${2:-${default_image_tag}}
readonly dedup_build=${3:-${default_dedup_build}}
readonly tag_as_this=${4:-}

readonly full_image_name=${registry_uri}:${image_tag}
readonly tagged_image_name=${registry_uri}:${tag_as_this}

# Check if we should skip the docker build if the image already exists
skip_build=false
if [[ ${dedup_build} == 'true' ]] ; then
  if aws ecr list-images --repository-name $(cut -d/ -f2 <<<${registry_uri}) \
      | grep -q "\"imageTag\": \"${image_tag}\"" ; then
    echo "Image with tag '${image_tag}' already exists; skipping build"
    skip_build=true

    # Pull the image; necessary so we can tag it below
    echo "Pulling image '${full_image_name}'"
    docker pull ${full_image_name}
  fi
fi

# Ensure we use run the docker build from the repo root
cd "$( dirname "${BASH_SOURCE[0]}" )"/..

# Build and push the image
if ! ${skip_build} ; then
  if [[ -n ${tag_as_this} ]] ; then
    echo "Pulling image '${tagged_image_name}' to be used as the cache image"
    docker pull ${tagged_image_name}
  fi

  echo "Building image '${full_image_name}'"
  docker build \
    --platform linux/arm64 \
    --target release \
    --tag ${full_image_name} \
    --cache-from ${tagged_image_name} \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -f 'docker/api.Dockerfile' .
  echo 'Finished building image'

  echo "Pushing image '${full_image_name}'"
  docker push ${full_image_name}
fi

# Tag and push tag if specified
if [[ -n ${tag_as_this} ]] ; then
  echo "Tagging and pushing image '${tagged_image_name}'"
  docker tag ${full_image_name} ${tagged_image_name}
  docker push ${tagged_image_name}
fi

echo 'Finished pushing images'
