import { AuthApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import { useLocalStorage } from "src/hooks"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

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
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh-token", "")

  const {
    data: user,
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/user" : null, async () => {
    const api = wrapApi(AuthApi)
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
    refreshToken,
    setRefreshToken,
    logout
  }
}

export default useUser
