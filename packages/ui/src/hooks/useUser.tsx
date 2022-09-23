import { AuthApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import { useLocalStorage } from "src/hooks"
import useSWR from "swr"

export interface JWTUserClaims {
  sub: string
  isVerified: boolean
  isCreator: boolean
  isEmailVerified: boolean
  aud: string
  iss: string
  iat: string
  exp: string
}

const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage("access-token", "")
  const [, setRefreshToken] = useLocalStorage("refresh-token", "")

  const {
    data: user,
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/user" : null, async () => {
    // When this flag is false there is not yet a user to retrieve
    if (!jwtDecode<JWTUserClaims>(accessToken).isVerified) {
      return
    }
    const api = new AuthApi()
    return await api.getCurrentUser()
  })

  const logout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
  }

  return {
    user,
    loading,
    mutate,
    userClaims: accessToken ? jwtDecode<JWTUserClaims>(accessToken) : null,
    accessToken,
    setAccessToken,
    setRefreshToken,
    logout
  }
}

export default useUser
