import { AuthApi } from "@passes/api-client"
import { useLocalStorage } from "src/hooks"
import useSWR from "swr"

const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage("access-token", "")
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh-token", "")

  const { data: user, isValidating: loading } = useSWR(
    accessToken ? "/user" : null,
    async () => {
      const api = new AuthApi()
      return await api.authGetCurrentUser({
        headers: { Authorization: "Bearer " + accessToken }
      })
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
