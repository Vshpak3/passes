export function dirtyValues<T>(
  dirtyFields: Partial<Record<keyof T, boolean>> | boolean,
  allValues: T
): T {
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.fromEntries(
    Object.keys(dirtyFields).map((f) => [f, allValues[f as keyof T]])
  )
}
