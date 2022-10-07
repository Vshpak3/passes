/**
 * Displays either "1 word" or "X words".
 */
export function plural(word: string, count: number): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}
