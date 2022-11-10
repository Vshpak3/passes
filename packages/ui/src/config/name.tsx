// Rules:
//   1) Requires at least two or more words separated by a space
//   2) Each word must must only use characters [',\-.a-zA-Z]
//   3) Allows for accidental leading and trailing spaces
// Example of names that will pass:
//   - Ashes Meow
//   - Ashes d'Meow
//   - Ashes Purr Meow, Jr.
//   - Ashes Purr-Meow
export const FULL_NAME_REGEX = /^[ ',\-.a-zA-Z][',\-.a-zA-Z]* [ ',\-.a-zA-Z]+$/
