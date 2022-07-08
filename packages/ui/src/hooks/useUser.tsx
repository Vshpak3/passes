import { AuthApi } from "@moment/api-client"
import useSWR from "swr"

import useLocalStorage from "./useLocalStorage"

const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage("access-token", "")

  const { data: user, isValidating: loading } = useSWR("/user", async () => {
    const api = new AuthApi()
    const response = await api.authGetCurrentUser({
      headers: { Authorization: "Bearer " + accessToken }
    })
    return (response as any).user
  })

  return { user, loading, accessToken, setAccessToken }
}

export default useUser
