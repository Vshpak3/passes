/**
 * Formats date to `YYYY-MM-DD HH:MM:SS` format
 */

export const formatDateTimeToDbDateTime = (input: Date | string | number) => {
  let date = input
  if (!(date instanceof Date)) {
    date = new Date(input)
    // check if date is valid
    if (isNaN(date.getTime())) throw new Error('invalid date: ' + input)
  }
  return date.toISOString().slice(0, 19).replace('T', ' ')
}
