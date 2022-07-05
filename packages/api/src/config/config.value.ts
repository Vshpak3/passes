import { getSecretValue } from './config.secret'

const SECRET_PREFIX = 'secret/'

export async function getConfigValue(
  name: string,
  isNumber = false,
): Promise<string | number> {
  const value = process.env[name]
  if (value === undefined) {
    throw Error('This should never happen since joi should validate the config')
  }

  if (value.startsWith(SECRET_PREFIX)) {
    return await getSecretValue(value.replace(SECRET_PREFIX, ''))
  }

  if (isNumber) {
    return parseInt(value)
  } else {
    return value
  }
}
