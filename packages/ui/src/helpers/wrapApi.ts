import * as Api from "@passes/api-client"
import { AuthApi, DefaultConfig } from "@passes/api-client"
import jwtDecode from "jwt-decode"

// Util to handle:
// - Adding { "Content-Type": "application/json" } to the generated API
// - Adding authorization header when available in local storage
export const wrapApi = <T extends Api.BaseAPI>(api: {
  new (...args: any[]): T
}): T => {
  const configParams: Api.ConfigurationParameters = {
    basePath: DefaultConfig.basePath,
    headers: {
      "Content-Type": "application/json"
    }
  }

  if (typeof window === "undefined") {
    const config = new Api.Configuration(configParams)
    return new api(config)
  }

  const accessToken = window.localStorage.getItem("access-token")

  if (accessToken) {
    configParams.headers = {
      ...configParams.headers,
      Authorization: "Bearer " + JSON.parse(accessToken)
    }
  }

  const config = new Api.Configuration(configParams)
  return new api(config)
    .withPreMiddleware(async (context) => {
      const refreshToken = window.localStorage.getItem("refresh-token")
      if (!accessToken || !refreshToken) {
        return context
      }

      const decodedAuthToken = jwtDecode(accessToken) as any
      const isAuthTokenExpired = decodedAuthToken.exp <= Date.now() / 1000

      if (!isAuthTokenExpired) {
        return context
      }

      const decodedRefreshToken = jwtDecode(refreshToken) as any
      const isRefreshTokenExpired = decodedRefreshToken.exp <= Date.now() / 1000

      if (isRefreshTokenExpired) {
        window.localStorage.removeItem("access-token")
        window.localStorage.removeItem("refresh-token")
        return context
      }

      try {
        const authApi = new AuthApi()
        const refreshAuthTokenDto = { refreshToken: JSON.parse(refreshToken) }
        const res = await authApi.authRefreshAccessToken({
          refreshAuthTokenDto
        })

        if (res.accessToken) {
          const accessToken = JSON.stringify(res.accessToken)
          window.localStorage.setItem("access-token", accessToken)
          context.init.headers = {
            ...context.init.headers,
            Authorization: "Bearer " + accessToken
          }
        }

        return context
      } catch (err) {
        console.error("failed to refresh access token in interceptor", err)
        return context
      }
    })
    .withPostMiddleware(async (context) => {
      if (context.response.status === 401) {
        window.localStorage.removeItem("access-token")
        window.localStorage.removeItem("refresh-token")
      }

      return context.response
    })
}
