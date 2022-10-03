import { ResponseError } from "@passes/api-client"

export async function errorMessage(err: any): Promise<string | undefined> {
  return (await (err as ResponseError).response.json())?.message[0]
}
