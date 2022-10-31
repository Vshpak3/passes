// eslint-disable-next-line @typescript-eslint/ban-types
export async function sleep(ms: number): Promise<Function> {
  return new Promise((resolve) => setTimeout(resolve, Number(ms)))
}
