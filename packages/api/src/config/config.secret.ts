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

export async function getSecretValue(secretId: string): Promise<string> {
  return new Promise(resolve => {
    client
    .send(new GetSecretValueCommand({ SecretId: secretId }))
    .then((response) => {
      if (response === undefined) {
        throw Error(`Unable to get config secret '${secretId}'`)
      }

      if ('SecretString' in response) {
        resolve(response.SecretString!)
      } else {
        const buff = new Buffer(
          new TextDecoder().decode(response.SecretBinary),
          'base64',
        )
        resolve(buff.toString('ascii'))
      }
    })
    .catch((response) => {
      console.error(response)
    })
  })
}
