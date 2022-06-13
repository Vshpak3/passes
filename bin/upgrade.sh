#!/usr/bin/env bash
#
# Update all dependencies in the project.
#   - Node
#   - Yarn
#   - Each dependency
#
set -o errexit
set -o nounset
set -o pipefail

# Get the latest stable node version and update packages.json
node_version=$(n --stable)
echo "Updating Node to '${node_version}'"
cat <<< $(jq ".engines.node = \"${node_version}\"" < package.json) > package.json

# Update Yarn to the latest version
echo 'Updating Yarn'
yarn set version latest

# Run `yarn up` on each dependency
# `yarn up` without a package argument won't always update package.json. I think
# this happens if the yarn.lock file already contains the updated version?
# Regardless, `yarn up` does not reliably update package.json but this does.
echo 'Updating each dependency'
deps=(
    $(jq -r '.dependencies | keys[]' package.json)
    $(jq -r '.devDependencies | keys[]' package.json)
)
for dep in "${deps[@]}" ; do
    echo "Upgrading ${dep}"
    yarn up "${dep}"
done

echo 'Done!'
