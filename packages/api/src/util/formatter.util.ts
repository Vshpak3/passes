/**
 * Formats date to `YYYY-MM-DD HH:MM:SS` format
 */

export const formatDateTimeToDbDateTime = (input: Date | string | number) => {
  let date = input
  if (!(date instanceof Date)) {
    date = new Date(input)
    // check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('invalid date: ' + input)
    }
  }
  // eslint-disable-next-line no-magic-numbers
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

function isNumeric(value: string) {
  return !isNaN(parseFloat(value))
}

export function isCurrency(value: string) {
  if (!isNumeric(value)) {
    return false
  }
  if (value.indexOf('-') >= 0) {
    return false
  }
  const ind = value.indexOf('.')
  // eslint-disable-next-line no-magic-numbers
  return ind === -1 || ind > value.length - 4
}
