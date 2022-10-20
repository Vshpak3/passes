import { AuthApi, GetUserResponseDto, UserApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import { useEffect } from "react"
import { accessTokenKey, refreshTokenKey } from "src/helpers/token"
import { useLocalStorage } from "src/hooks/useLocalStorage"
import { swrConfig } from "src/pages/_app"
import useSWR, { useSWRConfig } from "swr"

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

export const useUser = () => {
  const [accessToken, setAccessToken] = useLocalStorage(accessTokenKey, "")
  const [, setRefreshToken] = useLocalStorage(refreshTokenKey, "")

  const authApi = new AuthApi()
  const userApi = new UserApi()

  const {
    data: user,
    isValidating: loading,
    mutate
  } = useSWR(
    accessToken ? CACHE_KEY_USER : null,
    async () => {
      // When this flag is false there is not yet a user to retrieve
      if (!jwtDecode<JWTUserClaims>(accessToken).isVerified) {
        return
      }

      return await authApi.getCurrentUser()
    },
    swrConfig
  )

  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAccessToken])

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<GetUserResponseDto>) =>
    _mutateManual(CACHE_KEY_USER, update, {
      populateCache: (
        update: Partial<GetUserResponseDto>,
        original: GetUserResponseDto
      ) => {
        return Object.assign(original, update)
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
    userClaims: accessToken ? jwtDecode<JWTUserClaims>(accessToken) : null,
    accessToken,
    setAccessToken,
    setRefreshToken,
    logout,
    updateUsername,
    updateDisplayName
  }
}
