import { ResponseError } from "@passes/api-client"
import { toast } from "react-toastify"

class HasMessage {
  message = ""
}

export async function errorMessage(err: unknown, withToast = false) {
  let errorMessage: string | string[] = "There was an unexpected error"

  if (err instanceof ResponseError) {
    const error = await err.response.json()

    if (error.statusCode < 500 && error.message) {
      errorMessage = error.message
    }
  } else if (err instanceof Error || (err as HasMessage).message) {
    errorMessage = (err as HasMessage).message
  }

  const messageStr = Array.isArray(errorMessage)
    ? errorMessage[0]
    : errorMessage

  if (withToast) {
    toast.error(messageStr)
  }

  return messageStr
}
