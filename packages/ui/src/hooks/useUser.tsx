import { AuthApi, GetUserResponseDto, UserApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import { useCallback } from "react"
import useSWR, { useSWRConfig } from "swr"

import { accessTokenKey, refreshTokenKey } from "src/helpers/token"
import { useLocalStorage } from "./storage/useLocalStorage"

export interface JWTUserClaims {
  sub: string
  isVerified: boolean
  isCreator: boolean
  isEmailVerified: boolean
  aud: string
  iss: string
  iat: number
  exp: number
}

const CACHE_KEY_USER = "/user"

const authApi = new AuthApi()
const userApi = new UserApi()

export const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage(accessTokenKey, "")
  const [, setRefreshToken] = useLocalStorage(refreshTokenKey, "")

  const fetch = useCallback(async () => {
    // When this flag is false there is not yet a user to retrieve

    // eslint-disable-next-line no-console
    console.log(accessToken, "in use user")
    if (!accessToken || !jwtDecode<JWTUserClaims>(accessToken).isVerified) {
      return
    }
    return await authApi.getCurrentUser()
  }, [accessToken])

  const {
    data: user,
    isValidating: loading,
    mutate
  } = useSWR<GetUserResponseDto | undefined>(CACHE_KEY_USER, fetch)

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<GetUserResponseDto>) =>
    _mutateManual(CACHE_KEY_USER, update, {
      populateCache: (
        update: Partial<GetUserResponseDto>,
        original?: GetUserResponseDto
      ) => {
        return Object.assign(original || {}, update)
      },
      revalidate: false
    })

  const logout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
  }

  const updateUsername = async (username: string) => {
    await userApi.setUsername({
      updateUsernameRequestDto: { username }
    })
    mutateManual({ username })
  }

  const updateDisplayName = async (displayName: string) => {
    await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })
    mutateManual({ displayName })
  }

  return {
    user,
    loading,
    mutate,
    mutateManual,
    fetch,
    userClaims: accessToken ? jwtDecode<JWTUserClaims>(accessToken) : null,
    accessToken,
    setAccessToken,
    setRefreshToken,
    logout,
    updateUsername,
    updateDisplayName
  }
}
