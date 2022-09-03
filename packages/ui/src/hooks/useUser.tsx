import { AuthApi } from "@passes/api-client"
import { useLocalStorage } from "src/hooks"
import useSWR from "swr"

import {
  refreshAccessToken as _refreshAccessToken,
  wrapApi
} from "../helpers/wrapApi"

const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage("access-token", "")
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh-token", "")

  const { data: user, isValidating: loading } = useSWR(
    accessToken ? "/user" : null,
    async () => {
      const api = wrapApi(AuthApi)
      return await api.getCurrentUser()
    }
  )

  const logout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
  }

  // Force refresh access token, to get updated isVerified, isCreator
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      return
    }

    const accessToken = await _refreshAccessToken(refreshToken)
    if (!accessToken) {
      return
    }

    setAccessToken(accessToken)
  }

  return {
    user,
    loading,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    refreshAccessToken,
    logout
  }
}

export default useUser
