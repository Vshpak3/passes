#!/usr/bin/env bash
#
# Generates API client.
#
# If the first parameter is set "true" then this script will regenerate the
# OpenAPI generator template files. We modify these files to include custom
# functionality. Whenever the OpenAPI generator is updated, we need to copy
# over our template modifications.
#
set -o errexit
set -o nounset
set -o pipefail

readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..

readonly api_client_path=packages/api-client
readonly spec_filename=packages/api/src/openapi/specs/openapi.json
readonly openapi_gen_version=6.1.0
readonly openapi_gen_generator=typescript-fetch

readonly out_path="${root}/${api_client_path}"


### Generates the OpenAPI template files

# Only regenerate the template files if the first argument is set true
if "${1:-false}" ; then
  echo -e "Only regenerating template files\n"
  docker run --rm -v ${root}:/local \
    openapitools/openapi-generator-cli:v${openapi_gen_version} author template  \
    --output "/local/bin/openapi" \
    --generator-name ${openapi_gen_generator}
  exit
fi


### Generate OpenAPI JSON File

yarn workspace @passes/api generate-openapi-spec


### Generate OpenAPI Javascript client

# Clean previously generated API client
rm -rf "${out_path}/src/"
rm -rf "${out_path}/dist/"
mkdir "${out_path}/src/"

# Generate API client package sources using the openapi-generator-cli docker
# image (we are running it this way as opposed to installing it from npm since
# the cli requires Java on the host env).
docker run --rm -v ${root}:/local \
  openapitools/openapi-generator-cli:v${openapi_gen_version} generate \
  --template-dir "/local/bin/openapi" \
  --input-spec "/local/${spec_filename}" \
  --output "/local/${api_client_path}/src" \
  --generator-name ${openapi_gen_generator}
echo

# Clean up unwanted cruft created by the generator
rm -rf "${out_path}/src/.openapi-generator*"


### Generate secured endpoint file

python3 <<EOT
import collections
import json
import os

with open('${spec_filename}') as f:
    spec = json.load(f)

yes_auth = collections.defaultdict(list)
no_auth = collections.defaultdict(list)
for path, method in spec['paths'].items():
    api_name = ''.join(map(str.capitalize, path.split('/')[2].split('-')))
    for operation in method.values():
        if operation.get('security') != [{'bearer': []}]:
            no_auth[api_name].append(operation['operationId'])
        else:
            yes_auth[api_name].append(operation['operationId'])

for api, ops in yes_auth.items():
    security_info_content = f"""
export const {api}SecurityInfo = new Set<string>([
{f"{os.linesep}".join([f'    "{op}",' for op in sorted(ops)])}
])
"""
    with open(os.path.join('packages/api-client', f'src/apis/{api}Api.ts'), 'a') as f:
        f.write(security_info_content)

no_auth_print_str = sorted(f'{api}.{op}' for api, ops in no_auth.items() for op in ops)
print(f'No full authentication for endpoints:{os.linesep}- {f"{os.linesep}- ".join(no_auth_print_str)}')
EOT
echo


### Finishing Touches

# Transpile generated TypeScript sources to JavaScript
yarn workspace @passes/api-client build

echo 'Done!'
