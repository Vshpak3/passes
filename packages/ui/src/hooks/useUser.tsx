import { AuthApi } from "@moment/api-client"
import useSWR from "swr"

import useLocalStorage from "./useLocalStorage"

const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage("access-token", "")
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh-token", "")

  const { data: user, isValidating: loading } = useSWR("/user", async () => {
    const api = new AuthApi()
    return await api.authGetCurrentUser({
      headers: { Authorization: "Bearer " + accessToken }
    })
  })

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
