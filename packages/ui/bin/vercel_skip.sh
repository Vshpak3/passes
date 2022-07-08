#!/usr/bin/env bash
#
# Ensures we only deploy Vercel on branches "preview". and "main".
# This script is specified in the Vercel settings page.
#

function proceed() {
    echo "✅ - Build can proceed"
    exit 1
}

function cancel() {
    echo "🛑 - Build cancelled"
    exit 0
}

# Output all Vercel Git environment variables
# Documented here: https://vercel.com/docs/concepts/git/vercel-for-gitlab
cat <<EOT
VERCEL_GIT_PROVIDER: ${VERCEL_GIT_PROVIDER}
VERCEL_GIT_REPO_SLUG: ${VERCEL_GIT_REPO_SLUG}
VERCEL_GIT_REPO_OWNER: ${VERCEL_GIT_REPO_OWNER}
VERCEL_GIT_REPO_ID: ${VERCEL_GIT_REPO_ID}
VERCEL_GIT_COMMIT_REF: ${VERCEL_GIT_COMMIT_REF}
VERCEL_GIT_COMMIT_SHA: ${VERCEL_GIT_COMMIT_SHA}
VERCEL_GIT_COMMIT_MESSAGE: ${VERCEL_GIT_COMMIT_MESSAGE}
VERCEL_GIT_COMMIT_AUTHOR_LOGIN: ${VERCEL_GIT_COMMIT_AUTHOR_LOGIN}
VERCEL_GIT_COMMIT_AUTHOR_NAME: ${VERCEL_GIT_COMMIT_AUTHOR_NAME}
EOT

echo "Path: ${PWD}"
echo

# Checks if the UI directory was modified
if ! git diff HEAD^ HEAD --quiet -- .; then
    proceed
else
    cancel
fi

# Optional checks to restrict to certain branches
# if [[ "${VERCEL_GIT_COMMIT_REF}" == "preview" || "${VERCEL_GIT_COMMIT_REF}" == "main"  ]] ; then
#     proceed
# else
#     cancel
# fi
