#!/usr/bin/env bash
#
# Create local s3 bucket if it doesn't exist
#
set -o errexit
set -o nounset
set -o pipefail

readonly container_name="passes-s3"
readonly bucket_name="passes"

docker compose up --detach --no-recreate s3

docker exec ${container_name} awslocal s3 mb s3://${bucket_name}
