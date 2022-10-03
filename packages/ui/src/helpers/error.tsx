import { ResponseError } from "@passes/api-client"
export async function errorMessage(err: any) {
  const messageError = await (err as ResponseError).response.json()

  if (messageError.message) {
    return messageError.message
  }

  return "Error"
}
