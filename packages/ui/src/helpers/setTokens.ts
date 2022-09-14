export function setTokens(
  setAccessToken: (value: string) => void,
  setRefreshToken: (value: string) => void,
  accessToken?: string,
  refreshToken?: string
): boolean {
  if (!accessToken) {
    return false
  }
  setAccessToken(accessToken)
  if (refreshToken) {
    setRefreshToken(refreshToken)
  }
  return true
}
