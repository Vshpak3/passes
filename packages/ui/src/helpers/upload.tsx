export async function promiseAllBatched<T>(
  items: T[],
  task: (file: T) => Promise<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  batchSize: number
) {
  let position = 0
  let results: string[] = []
  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + batchSize)
    results = [
      ...results,
      ...(await Promise.all(itemsForBatch.map((item) => task(item))))
    ]
    position += batchSize
  }
  return results
}

export async function retryWrapper<T>(
  fn: () => Promise<T>,
  retries: number
): Promise<T> {
  if (retries > 0) {
    return fn()
      .then((r: T) => r)
      .catch((err: unknown) => {
        console.error("Upload fail; retrying", err)
        return retryWrapper(fn, retries - 1)
      })
  } else {
    console.error("Upload reached max failure count")
    throw new Error("Upload reached max failure count")
  }
}
