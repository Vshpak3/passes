#!/usr/bin/env bash
#
# Custom linting for the ui package. Requires yarn.
#

function log() {
  echo -e "\n${1}\n"
}

cd "$( dirname "${BASH_SOURCE[0]}" )"/../..

log "Looking for unused exports (dead code)"
unused_exports=$(
  yarn workspace @passes/ui ts-unused-exports tsconfig.json \
    --showLineNumber \
    | grep -v /src/pages/ \
    | grep /src/ \
    || true
)

if [[ -n "${unused_exports}" ]] ; then
    cat << EOT
The following variables are exported but not used anywhere in the codebase:
$(sed 's/^/- /g' <<<"${unused_exports}")

To fix, do one of the following:
  1) Remove the code if the code is no longer needed
  1) Remove the export if the variable is used elsewhere in the file
  3) Remove the export and add an unused eslint export like so:
     \`\`\`
     // Might be used in the future
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const SomeComponentHere: FC<Props> = ({
     \`\`\`
EOT
exit 1
fi

log "Looking for unused dependencies"

readonly skip_packages=(
  @types/prop-types
  @types/react-dom
  @typescript-eslint/eslint-plugin
  @typescript-eslint/parser
  autoprefixer
  depcheck
  eslint-config-prettier
  eslint-plugin-eslint-comments
  eslint-plugin-import
  eslint-plugin-jsx-a11y
  eslint-plugin-prettier
  eslint-plugin-promise
  eslint-plugin-regexp
  eslint-plugin-simple-import-sort
  eslint-plugin-sonarjs
  prettier-plugin-tailwindcss
  ts-unused-exports
)

unused_dependencies=$(
  yarn workspace @passes/ui depcheck \
    --skip-missing true \
    --ignores $(echo ${skip_packages[@]} | tr ' ' ',') \
    | grep -v 'No depcheck issue'
)

if [[ -n "${unused_dependencies}" ]] ; then
    cat << EOT
The following dependencies are no longer being used in the codebase:

$(sed 's/^/  /g' <<<"${unused_dependencies}")

To fix, please remove the dependency from \`packages/ui/package.json\` and
run \`yarn install\`.
EOT
exit 1
fi

log "Success!"
