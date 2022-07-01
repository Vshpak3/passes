export function getConfigValue(
  name: string,
  isNumber = false,
): string | number {
  const value = process.env[name]
  if (value === undefined) {
    throw Error('This should never happen since joi should validate the config')
  }

  if (value.startsWith('secret/')) {
    // TODO RETRIEVE FROM AWS SECRET MANAGER HERE
    throw Error('NOT YET IMPLEMENTED')
  }

  if (isNumber) {
    return parseInt(value)
  } else {
    return value
  }
}
