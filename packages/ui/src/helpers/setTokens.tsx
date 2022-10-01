import { AccessTokensResponseDto } from "@passes/api-client"

export function setTokens(
  tokens: AccessTokensResponseDto,
  setAccessToken: (value: string) => void,
  setRefreshToken: (value: string) => void
): boolean {
  if (!tokens.accessToken) {
    return false
  }
  setAccessToken(tokens.accessToken)

  if (tokens.refreshToken) {
    setRefreshToken(tokens.refreshToken)
  }
  return true
}
