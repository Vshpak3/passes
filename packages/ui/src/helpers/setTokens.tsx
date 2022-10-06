import { AccessTokensResponseDto } from "@passes/api-client"
import { toast } from "react-toastify"

export function setTokens(
  tokens: AccessTokensResponseDto,
  setAccessToken: (value: string) => void,
  setRefreshToken: (value: string) => void,
  logErrors = true
): boolean {
  if (!tokens.accessToken) {
    if (logErrors) {
      toast.error("Something went wrong, please try again later")
      console.error("Unexpected missing access token")
    }
    return false
  }
  setAccessToken(tokens.accessToken)

  if (tokens.refreshToken) {
    setRefreshToken(tokens.refreshToken)
  }
  return true
}
