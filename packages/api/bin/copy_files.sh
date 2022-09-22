#!/usr/bin/env sh
#
# Copies non-code files from /src to /dist/src so they are available for builds.
# This script is specified in the backend Dockerfile.
#
set -o errexit
set -o nounset
set -o pipefail

cd "$( dirname "${0}" )"/..

function copy {
  local path=${1}
  local file_glob=${2}
  find ${path} -type f -name "${file_glob}" \
    -exec sh -c 'mkdir -p dist/$(dirname {}) && cp {} $(echo {} | sed "s~src/~dist/src/~")' \;
}

copy src/config '.env.*'
copy src/modules/email '*.html'
copy src/modules/email '*.css'
