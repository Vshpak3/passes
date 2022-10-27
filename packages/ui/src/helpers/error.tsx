import { ResponseError } from "@passes/api-client"
import { toast } from "react-toastify"

export async function errorMessage(err: unknown, withToast = false) {
  let errorMessage: string | string[] = "Something went wrong"

  if (err instanceof ResponseError) {
    const error = await err.response.json()

    if (error.message) {
      errorMessage = error.message
    }
  } else if (err instanceof Error) {
    errorMessage = err.message
  }

  const messageStr = Array.isArray(errorMessage)
    ? errorMessage[0]
    : errorMessage

  if (withToast) {
    toast.error(messageStr)
  }

  return messageStr
}
