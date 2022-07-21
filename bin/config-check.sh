#!/usr/bin/env bash
#
# Checks configs to ensure that
#   1) Each environment's config has the same keys.
#   2) Each declared secret exists in Terraform.
#
# This script requires that the infra repo can be found at ../infra.
#
set -o errexit
set -o nounset
set -o pipefail

readonly env_filepath=packages/api/src/config/
readonly tf_secret_filepath=../infra/terraform/config/common.tfvars
readonly log_everything=false

readonly root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"/..

function get_keys() {
  local filename=${1}
  cat ${root}/${env_filepath}/${filename} | tr -d ' ' | cut -d= -f1 | cut -d# -f1 | sed '/^$/d'
}

out='/dev/null'
if [[ "${log_everything}" == true ]] ; then
  out='/dev/stdout'
fi

# Check #1

echo "Dev config keys:" > ${out}
dev=$(get_keys .env.dev)
echo "${dev}" | sed 's/^/  /' > ${out}

echo "Stage config keys:" > ${out}
stage=$(get_keys .env.stage)
echo "${stage}" | sed 's/^/  /' > ${out}

echo "Prod config keys:" > ${out}
prod=$(get_keys .env.prod)
echo "${prod}" | sed 's/^/  /' > ${out}

if [[ "${stage}" != "${dev}" ]] ; then
  echo "Stage config keys do not match dev config keys"
  exit 1
fi

if [[ "${prod}" != "${dev}" ]] ; then
  echo "Prod config keys do not match dev config keys"
  exit 1
fi

# Check #2

monorepo_secrets=$(cat ${root}/${env_filepath}/.env.* | tr -d ' ' | cut -d= -f2 | cut -d# -f1 \
              | sed '/^$/d' | grep secret/ | rev | cut -d/ -f1 | rev | sort -u)
echo "All secrets listed in configs:" > ${out}
echo "${monorepo_secrets}" | sed 's/^/  /' > ${out}

terraform_secrets=$(sed -n '/^application_secrets/,/^]$/p' ${root}/${tf_secret_filepath} \
                    | sed -n -e 's/.*"\([a-z-]*\)".*/\1/p')
echo "All secrets listed in secret list:" > ${out}
echo "${terraform_secrets}" | sed 's/^/  /' > ${out}

secrets_in_infra_not_monorepo=$(comm -13 <(echo "${monorepo_secrets}") <(echo "${terraform_secrets}"))
secrets_in_monorepo_not_infra=$(comm -23 <(echo "${monorepo_secrets}") <(echo "${terraform_secrets}"))

if [[ -n "${secrets_in_infra_not_monorepo}" ]] ; then
  cat <<EOT
Found secrets in the infra repo but not the monorepo:
$(echo "${secrets_in_infra_not_monorepo}" | tr -d ' ' | sed 's/^/  /')
This will not fail the tests but please either reference this secret in the
monorepo soon or remove it from Terraform.

EOT
fi

if [[ -n "${secrets_in_monorepo_not_infra}" ]] ; then
  cat <<EOT
Found secrets in the monorepo but not the infra repo:
$(echo "${secrets_in_monorepo_not_infra}" | tr -d ' ' | sed 's/^/  /')
This will fail the tests since your deploy will fail without this secret. Please
add your secret to Terraform and follow the secret deploy instructions.

EOT
  exit 1
fi
