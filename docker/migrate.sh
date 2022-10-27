#!/usr/bin/env bash
#
# Runs schema migration task in ECS.
# Requires AWS auth.
#
# Usage
#
#   ./docker/migrate.sh <task family> <cluster name> <subnet ids> <security group> <image name>
#
set -o errexit
set -o nounset
set -o pipefail

# Input
readonly task_family=${1}
readonly cluster_name=${2}
readonly subnet_ids=${3}
readonly security_group=${4}
readonly image_name=${5}

# describe-task-definition returns additional fields that cause errors when
# using register-task-definition so we delete those fields
old_task_definition=$(aws ecs describe-task-definition --task-definition ${task_family})
new_task_defintiion=$(
  echo ${old_task_definition} | jq -r --arg IMAGE ${image_name} \
    '.taskDefinition |
     .containerDefinitions[0].image = $IMAGE |
     .runtimePlatform={
      "operatingSystemFamily": "LINUX",
      "cpuArchitecture": "ARM64"
     } |
     del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)'
)

new_task_info=$(aws ecs register-task-definition --family ${task_family} --cli-input-json "${new_task_defintiion}")
new_revision=$(echo ${new_task_info} | jq -r '.taskDefinition.revision')

run_result=$(
  aws ecs run-task --cluster $cluster_name --task-definition ${task_family}:${new_revision} \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[${subnet_ids}],securityGroups=[${security_group}]}"
)
task_arn=$(echo ${run_result} | jq -r '.tasks[0].taskArn')
echo "Task ARN ${task_arn}"

aws ecs wait tasks-stopped --cluster ${cluster_name} --tasks ${task_arn}
describe_result=$(aws ecs describe-tasks --cluster ${cluster_name} --tasks ${task_arn})

terminated_status=$(echo ${describe_result} | jq -r '.tasks[0].containers[0].exitCode')

echo "Status code ${terminated_status}"
if [[ ${terminated_status} != "0" ]] ; then
  echo ${describe_result} | jq
fi

exit ${terminated_status}
