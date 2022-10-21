#!/usr/bin/env bash
#
# Custom linting for the ui package.
#

# cd to packages/ui
cd "$( dirname "${BASH_SOURCE[0]}" )"/..

function report_problem_file() {
  local files=${1}
  local header=${2}
  local footer=${3}
  if [[ -n "${files}" ]] ; then
    cat << EOT
${header}
$(sed 's/^/- /g' <<<"${files}")

${footer}
EOT
    exit 1
  fi
}

# Find any files defined directly in the src directory.
files_in_src=$(find src -type f -maxdepth 1)
report_problem_file "${files_in_src}" \
  "The following files are in the src directory:" \
  "To fix, please move them to somewhere else."

# Find any files defined directly in the src components.
files_in_component=$(find src/components -type f -maxdepth 1)
report_problem_file "${files_in_component}" \
  "The following files are in the component directory:" \
  "To fix, please move them to into a component subdirectory."

# Detect pages that are uppercase. This often will catch components defined in
# the pages directory that should not be there.
uppercase_pages=$(find src/pages -type f | grep -E '[A-Z]')
report_problem_file "${uppercase_pages}" \
  "The following files are components defined in the pages directory:" \
  "To fix, please move them to the components directory."

# Detect any newly added JavaScript files.
javascript_files=$(find src -type f -name '*.js*')
report_problem_file "${javascript_files}" \
  "The following files are newly added JavaScript files:" \
  "To fix, please convert to Typescript."

# Detect any newly added non-TS files.
not_allowed_files=$(find src -type f -not -name '*.ts*' | grep -v '.css$')
report_problem_file "${not_allowed_files}" \
  "The following files are not Typescript nor CSS:" \
  "To fix, please remove."

# Find files named with dashes.
files_with_dashes=$(find src -name '*-*.ts*' \
  -not -path 'src/config/*' \
  -not -path 'src/pages/*' \
  -not -path 'src/helpers/*'
)
report_problem_file "${files_with_dashes}" \
  "The following files have dashes in them:" \
  "To fix, please convert to PascalCase."

# Find files starting with lowercase.
files_with_lowercase=$(find src/components -name '[a-z]*' -type f -not -path '*/index.tsx')
report_problem_file "${files_with_lowercase}" \
  "The following files in the components directory start with a lowercase:" \
  "To fix, please convert to PascalCase."

# Detect assets that are no longer being used.
extra_assets=($(
  find public -type f | while read file ; do
    echo ${file} | cut -d/ -f2- | xargs -I{} grep -r -q {} src/ || echo ${file}
  done
))
report_problem_file "${extra_assets}" \
  "The following files in public/ are not being referenced anywhere:" \
  "To fix, please remove them."


echo "Success!"
