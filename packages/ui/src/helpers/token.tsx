import { AuthApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"

import { JWTUserClaims } from "src/hooks/useUser"

export const accessTokenKey = "access-token"
export const refreshTokenKey = "refresh-token"

/**
 * Checks the expiration of the token.
 *
 * @param timeRemaining Check if the access token has less than or equal to
 *                      this time remaining (in seconds).
 * @returns Boolean whether or not the token is valid (not expired).
 */
export const tokenStillValid = (
  token: JWTUserClaims,
  timeRemaining = 0
): boolean => {
  return token.exp - Date.now() / 1000 > timeRemaining
}

const _refreshAccessToken = async (
  refreshToken: string
): Promise<string | undefined> => {
  try {
    const authApi = new AuthApi()
    const res = await authApi.refreshAccessToken({
      refreshAuthTokenRequestDto: { refreshToken: JSON.parse(refreshToken) }
    })

    if (!res.accessToken) {
      console.error("Did not receive an access token")
      return undefined
    }
    console.log("Access token was refreshed") // eslint-disable-line no-console
    return res.accessToken
  } catch (err) {
    console.error("Failed to refresh access token:", err)
    return undefined
  }
}

/**
 * Updates the access token using the refresh token.
 *
 * @param timeRemaining Refresh if the access token has less than or equal to
 *                        this time remaining (in seconds).
 * @returns True if the token was refreshed and False otherwise.
 */
export const refreshAccessToken = async (
  timeRemaining: number = 5 * 60 // 5 minutes
): Promise<string | undefined> => {
  const accessToken = window.localStorage.getItem(accessTokenKey)
  const refreshToken = window.localStorage.getItem(refreshTokenKey)

  if (!refreshToken) {
    return undefined
  }

  if (
    accessToken &&
    tokenStillValid(jwtDecode<JWTUserClaims>(accessToken), timeRemaining)
  ) {
    return undefined
  }

  return await _refreshAccessToken(refreshToken)
}
