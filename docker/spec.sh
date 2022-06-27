#!/usr/bin/env bash
#
# Creates various deploy files. Used in build pipeline.
#
# Files are:
#   appspec.json: https://docs.aws.amazon.com/codedeploy/latest/userguide/tutorial-ecs-create-appspec-file.html
#   imageDetail.json: https://docs.aws.amazon.com/codepipeline/latest/userguide/file-reference.html#file-reference-ecs-bluegreen
#   taskdef.json: https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-ecs-ecr-codedeploy.html#tutorials-ecs-ecr-codedeploy-taskdefinition
#
# Usage
#
#   ./docker/spec.sh <registry uri> <image tag>
#
set -o errexit
set -o nounset
set -o pipefail

# Configuration
readonly task_definition_name=moment-api-dev

# Input
readonly docker_registry=${1}
readonly image_tag=${2}

echo 'Writing definition specs...'

cat <<EOT | tr -d '[:space:]' > appspec.json
{
  "version": 0,
  "Resources": [
    {
      "TargetService": {
        "Type": "AWS::ECS::Service",
        "Properties": {
           "TaskDefinition": "<TASK_DEFINITION>",
           "LoadBalancerInfo": {
              "ContainerName": "moment-api-dev",
              "ContainerPort": 3001
           }
        }
      }
    }
  ]
}
EOT

printf '{"ImageURI":"%s"}' ${docker_registry}:${image_tag} > imageDetail.json

aws ecs describe-task-definition --task-definition ${task_definition_name} | jq '.taskDefinition' > taskdef.json

function cat_file() {
  local filename=$1
  echo -e "${filename}:\n"
  cat ${filename}
  echo -e "\n\n"
}

cat_file appspec.json
cat_file imageDetail.json
cat_file taskdef.json
