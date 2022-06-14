#!/usr/bin/env sh
set -e
set -x

OUT_PATH="packages/api-client"
ABS_OUT_PATH="${PWD}/${OUT_PATH}"
SPEC_FILENAME="openapi.json"

# Clean previously generated API client
[ -d "${ABS_OUT_PATH}/src/" ] && rm -r "${ABS_OUT_PATH}/src/"
[ -d "${ABS_OUT_PATH}/dist/" ] && rm -r "${ABS_OUT_PATH}/dist/"

mkdir "${ABS_OUT_PATH}/src/"

# Generate API client package sources using the openapi-generator-cli docker
# image (we are running it this way as opposed to installing it from npm since
# the cli requires Java on the host env).
docker run --rm -u $(id -u ${USER}):$(id -g ${USER}) \
  -v ${PWD}:/local \
  openapitools/openapi-generator-cli:v5.1.1 generate \
  -i "/local/packages/api/${SPEC_FILENAME}" \
  --skip-validate-spec \
  -g typescript-axios \
  -o "/local/${OUT_PATH}/src" \
  --additional-properties useSingleRequestParameter=true

# Clean up unwanted cruft created by the generator
# rm -r "${ABS_OUT_PATH}src/.openapi-generator"
rm "${ABS_OUT_PATH}/src/.gitignore"
rm "${ABS_OUT_PATH}/src/.npmignore"
rm "${ABS_OUT_PATH}/src/.openapi-generator-ignore"
rm "${ABS_OUT_PATH}/src/git_push.sh"

{ set +x; } 2>/dev/null
echo "export const schema = $(cat "${PWD}/packages/api/${SPEC_FILENAME}" ) as const;" > "${ABS_OUT_PATH}/src/schema.ts"
set -x

echo "export * from './schema';" >> "${ABS_OUT_PATH}/src/index.ts"

{ set +x; } 2>/dev/null

# Transpile generated .ts sources to js
yarn workspace @moment/api-client build
