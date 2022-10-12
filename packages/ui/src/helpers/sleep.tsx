import ms from "ms"

export async function sleep(time: string) {
  await new Promise((resolve) => setTimeout(resolve, ms(time)))
}
