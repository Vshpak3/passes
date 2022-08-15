import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'

import { infra_config_aws_region } from './config.options'

// Global instantiation of AWS client. Please avoid this pattern. Configs are
// special and this cannot be easily dependency injected.
const client = new SecretsManagerClient({
  region: infra_config_aws_region,
})

function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage)
}

export async function getSecretValue(secretId: string): Promise<string> {
  return new Promise((resolve) => {
    client
      .send(new GetSecretValueCommand({ SecretId: secretId }))
      .then((response) => {
        response ?? throwExpression(`Unable to get config secret '${secretId}'`)

        // eslint-disable-next-line promise/always-return
        if ('SecretString' in response) {
          resolve(
            response.SecretString ?? throwExpression(`SecretString not set`),
          )
        } else {
          const buff = new Buffer(
            new TextDecoder().decode(
              response.SecretBinary ?? throwExpression(`SecretBinary not set`),
            ),
            'base64',
          )
          resolve(buff.toString('ascii'))
        }
      })
      .catch((response) => {
        // Logger is not yet available
        console.error(response)
      })
  })
}
