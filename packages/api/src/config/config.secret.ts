import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'

// Global instantiation of AWS client. Please avoid this pattern. Configs are
// special and this cannot be easily dependency injected.
const client = new SecretsManagerClient({
  // region: process.env.AWS_DEFAULT_REGION,
})

export async function getSecretValue(secretId: string): Promise<string> {
  let secret: string | undefined

  await client
    .send(new GetSecretValueCommand({ SecretId: secretId }))
    .then((response) => {
      if ('SecretString' in response) {
        secret = response.SecretString
      } else {
        const buff = new Buffer(
          new TextDecoder().decode(response.SecretBinary),
          'base64',
        )
        secret = buff.toString('ascii')
      }
      return secret
    })
    .catch((response) => {
      console.error(response)
    })

  if (secret === undefined) {
    throw Error(`Unable to get config secret '${secretId}'`)
  }

  return secret
}
