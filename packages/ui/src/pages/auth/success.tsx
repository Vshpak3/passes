import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import {
  authRouter,
  AuthStates,
  authStateToRoute
} from "src/helpers/authRouter"
import { queryParam } from "src/helpers/query"
import { setTokens } from "src/helpers/setTokens"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { JWTUserClaims, useUser } from "src/hooks/useUser"

const AuthSuccess: FC = () => {
  const router = useRouter()
  const { safePush } = useSafeRouter()
  const { mutate, setAccessToken, setRefreshToken } = useUser()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const accessToken = queryParam(router.query.accessToken) as string
    const refreshToken = queryParam(router.query.refreshToken) as string

    const setRes = setTokens(
      { accessToken, refreshToken },
      setAccessToken,
      setRefreshToken
    )
    if (!setRes) {
      safePush(authStateToRoute(AuthStates.LOGIN))
      return
    }

    mutate()

    authRouter(safePush, jwtDecode<JWTUserClaims>(accessToken))
  }, [router, mutate, setAccessToken, setRefreshToken, safePush])

  return null
}

export default AuthSuccess // no WithNormalPageLayout
