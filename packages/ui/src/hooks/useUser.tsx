import { AuthApi, GetUserResponseDto } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import { accessTokenKey, refreshTokenKey } from "src/helpers/token"
import { useLocalStorage } from "src/hooks"
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

const useUser = (revalidateOnMount = true) => {
  const [accessToken, setAccessToken] = useLocalStorage(accessTokenKey, "")
  const [, setRefreshToken] = useLocalStorage(refreshTokenKey, "")

  const {
    data: user,
    isValidating: loading,
    mutate
  } = useSWR(
    accessToken ? "/user" : null,
    async () => {
      // When this flag is false there is not yet a user to retrieve
      if (!jwtDecode<JWTUserClaims>(accessToken).isVerified) {
        return
      }

      const api = new AuthApi()
      return await api.getCurrentUser()
    },
    { revalidateOnMount: revalidateOnMount }
  )

  const { mutate: mutateManual } = useSWRConfig()

  const logout = () => {
    setAccessToken(undefined)
    setRefreshToken(undefined)
  }

  return {
    user,
    loading,
    mutate,
    mutateManual: (update: Partial<GetUserResponseDto>) =>
      mutateManual("/user", update, {
        populateCache: (
          update: Partial<GetUserResponseDto>,
          original: GetUserResponseDto
        ) => {
          return Object.assign(original, update)
        },
        revalidate: false
      }),
    userClaims: accessToken ? jwtDecode<JWTUserClaims>(accessToken) : null,
    accessToken,
    setAccessToken,
    setRefreshToken,
    logout
  }
}

export default useUser
