import { getSecretValue } from './config.secret'

const SECRET_PREFIX = 'secret/'

export async function getConfigValue(
  name: string,
  parseFunction?: (value: string) => any,
): Promise<string | number | object> {
  const value = process.env[name]
  if (value === undefined) {
    throw Error('This should never happen since joi should validate the config')
  }

  if (value.startsWith(SECRET_PREFIX)) {
    return await getSecretValue(value.replace(SECRET_PREFIX, ''))
  }

  if (parseFunction) {
    return parseFunction(value)
  } else {
    return value
  }
}
