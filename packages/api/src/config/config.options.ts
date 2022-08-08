import path from 'path'

import { configConfiguration, configValidationSchema } from './config.schema'

// Once the config module is instantiated it will remove all system environment
// variables (due to the setting ignoreEnvVars: true). We need to pull out the
// variables we care about before this happen Since configs get evaluated at
// import-time (that's when the module is created), we need to do this here
export const infra_config_node_env = process.env.NODE_ENV ?? 'dev'
export const infra_config_aws_region = process.env.AWS_REGION
console.log(`Set by infra:
  - NODE_ENV: ${infra_config_node_env},
  - AWS_REGION: ${infra_config_aws_region}`)

export const configOptions = {
  envFilePath: path
    .join(__dirname, `.env.${infra_config_node_env}`)
    .replace('dist/', ''),
  load: [configConfiguration],
  validationSchema: configValidationSchema,
  isGlobal: true,
  ignoreEnvVars: true,
  validationOptions: {
    allowUnknown: false,
    abortEarly: true,
  },
}
