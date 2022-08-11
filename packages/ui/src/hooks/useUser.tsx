import { AuthApi } from "@passes/api-client"
import { useLocalStorage } from "src/hooks"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage("access-token", "")
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh-token", "")

  const { data: user, isValidating: loading } = useSWR(
    accessToken ? "/user" : null,
    async () => {
      const api = wrapApi(AuthApi)
      return await api.authGetCurrentUser()
    }
  )

  return {
    user,
    loading,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken
  }
}

export default useUser
