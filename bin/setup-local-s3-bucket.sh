#!/usr/bin/env bash
#
# Create local s3 bucket if it doesn't exist
#
set -o errexit
set -o nounset
set -o pipefail

readonly bucket_name="passes"

docker exec s3 awslocal s3 mb s3://${bucket_name}
