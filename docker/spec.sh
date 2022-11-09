#!/usr/bin/env bash
#
# Creates various deploy files. Used in build/deploy pipeline.
# Requires AWS auth.
#
# Files are:
#   appspec.json: https://docs.aws.amazon.com/codedeploy/latest/userguide/tutorial-ecs-create-appspec-file.html
#   imageDetail.json: https://docs.aws.amazon.com/codepipeline/latest/userguide/file-reference.html#file-reference-ecs-bluegreen
#   taskdef.json: https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-ecs-ecr-codedeploy.html#tutorials-ecs-ecr-codedeploy-taskdefinition
#
# Usage
#
#   ./docker/spec.sh <registry uri> <image tag> <task family name>
#
set -o errexit
set -o nounset
set -o pipefail

# Constants
readonly application_port=3001

# Input
readonly docker_registry=${1}
readonly image_tag=${2}
readonly task_family_name=${3}

echo 'Writing definition specs...'

cat << EOT > appspec.json
{
  "version": 0,
  "Resources": [
    {
      "TargetService": {
        "Type": "AWS::ECS::Service",
        "Properties": {
           "TaskDefinition": "<TASK_DEFINITION>",
           "LoadBalancerInfo": {
              "ContainerName": "${task_family_name}",
              "ContainerPort": ${application_port}
           }
        }
      }
    }
  ]
}
EOT

printf '{"ImageURI":"%s"}' ${docker_registry}:${image_tag} > imageDetail.json

aws ecs describe-task-definition --task-definition ${task_family_name} \
  | jq --arg updateName ${task_family_name} \
       --arg updateImage "<IMAGE1_NAME>" \
       '.taskDefinition |
        .containerDefinitions =
          [.containerDefinitions[] |
           if (.name == $updateName)
           then (.image = $updateImage) else . end] |
        .runtimePlatform={
          "operatingSystemFamily": "LINUX",
          "cpuArchitecture": "ARM64"
        }' \
  > taskdef.json

function cat_file() {
  local filename=$1
  echo -e "${filename}:\n"
  cat ${filename}
  echo -e '\n\n'
}

cat_file appspec.json
cat_file imageDetail.json
cat_file taskdef.json
