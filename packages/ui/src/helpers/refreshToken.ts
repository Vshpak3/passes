import { AuthApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"

import { JWTUserClaims } from "../hooks/useUser"

const _refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
  try {
    const authApi = new AuthApi()
    const res = await authApi.refreshAccessToken({
      refreshAuthTokenRequestDto: { refreshToken }
    })
    if (!res.accessToken) {
      console.error("did not receive an access token")
      return false
    }
    window.localStorage.setItem("access-token", JSON.stringify(res.accessToken))
    return true
  } catch (err) {
    console.error("failed to refresh access token:", err)
    return false
  }
}

/**
 * Updates the access token using the refresh token.
 *
 * @param timeRemaining Refresh if the access token has less than or equal to
 *                        this time remaining (in seconds).
 * @returns True if the token was refreshed and False otherwise.
 */
const refreshAccessToken = async (
  timeRemaining: number = 5 * 60 // 5 minutes
): Promise<boolean> => {
  const accessToken = window.localStorage.getItem("access-token")
  const refreshToken = window.localStorage.getItem("refresh-token")

  if (!refreshToken) {
    return false
  }

  if (accessToken) {
    const decodedAuthToken = jwtDecode<JWTUserClaims>(accessToken)
    if (decodedAuthToken.exp - Date.now() / 1000 > timeRemaining) {
      return false
    }
  }

  return await _refreshAccessToken(refreshToken)
}

export default refreshAccessToken
