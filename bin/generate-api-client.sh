#!/usr/bin/env bash
#
# Generates API client
#
set -o errexit
set -o nounset
set -o pipefail

readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..

readonly api_client_path="packages/api-client"
readonly spec_filename="openapi.json"

out_path="${root}/${api_client_path}"

# Generate openapi.json file
yarn workspace @moment/api generate-openapi-spec

# Clean previously generated API client
[[ -d "${out_path}/src/" ]] && rm -r "${out_path}/src/"
[[ -d "${out_path}/dist/" ]] && rm -r "${out_path}/dist/"

mkdir "${out_path}/src/"

# Generate API client package sources using the openapi-generator-cli docker
# image (we are running it this way as opposed to installing it from npm since
# the cli requires Java on the host env).
docker run --rm -u $(id -u ${USER}):$(id -g ${USER}) \
  -v ${root}:/local \
  openapitools/openapi-generator-cli:v5.1.1 generate \
  -i "/local/packages/api/${spec_filename}" \
  --skip-validate-spec \
  -g typescript-fetch \
  -o "/local/${api_client_path}/src" \
  --additional-properties useSingleRequestParameter=true
echo

# Clean up unwanted cruft created by the generator
rm "${out_path}/src/.gitignore"
rm "${out_path}/src/.npmignore"
rm "${out_path}/src/.openapi-generator-ignore"
rm "${out_path}/src/git_push.sh"

echo "export const schema = $(cat "${root}/packages/api/${spec_filename}" ) as const;" > "${out_path}/src/schema.ts"
echo "export * from './schema';" >> "${out_path}/src/index.ts"

# Transpile generated .ts sources to js
yarn workspace @moment/api-client build

echo "Done!"
