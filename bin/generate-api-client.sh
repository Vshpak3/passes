#!/usr/bin/env bash
#
# Generates API client
#
set -o errexit
set -o nounset
set -o pipefail

readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..

readonly api_client_path='packages/api-client'
readonly spec_filename='openapi.json'
readonly openapi_gen_version='6.0.0'

out_path="${root}/${api_client_path}"

# Generate openapi.json file
yarn workspace @passes/api generate-openapi-spec

# Clean previously generated API client
[[ -d "${out_path}/src/" ]] && rm -r "${out_path}/src/"
[[ -d "${out_path}/dist/" ]] && rm -r "${out_path}/dist/"

mkdir "${out_path}/src/"

# Generate API client package sources using the openapi-generator-cli docker
# image (we are running it this way as opposed to installing it from npm since
# the cli requires Java on the host env).
docker run --rm -u $(id -u ${USER}):$(id -g ${USER}) \
  -v ${root}:/local \
  openapitools/openapi-generator-cli:v${openapi_gen_version} generate \
  --input-spec "/local/packages/api/${spec_filename}" \
  --output "/local/${api_client_path}/src" \
  --generator-name typescript-fetch
echo

# Clean up unwanted cruft created by the generator
rm -rf "${out_path}/src/.openapi-generator*"

# Create custom config for APIs
sed -i '' "/export const BASE_PATH/i\\
import { passesConfig } from './config'
" packages/api-client/src/runtime.ts
sed -i '' \
  's/DefaultConfig = new Configuration();/DefaultConfig = new Configuration(passesConfig);/' \
  "${out_path}/src/runtime.ts"
cat <<EOT > "${out_path}/src/config.ts"
import { ConfigurationParameters } from './runtime'

if (process.env.NEXT_PUBLIC_API_BASE_URL === undefined) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set")
}

export const passesConfig: ConfigurationParameters = {
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL
}
EOT

# Removed for now to prevent merge conflicts:
# Takes the openapi json spec and adds it as a constant
# echo "export const schema = $(cat "${root}/packages/api/${spec_filename}" ) as const;" > "${out_path}/src/schema.ts"
# echo "export * from './schema';" >> "${out_path}/src/index.ts"

# Transpile generated .ts sources to js
yarn workspace @passes/api-client build

echo "Done!"
