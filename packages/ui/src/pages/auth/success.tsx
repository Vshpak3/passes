import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUser } from "src/hooks"

import {
  authRouter,
  AuthStates,
  authStateToRoute
} from "../../helpers/authRouter"
import { setTokens } from "../../helpers/setTokens"
import { JWTUserClaims } from "../../hooks/useUser"

const AuthSuccess = () => {
  const router = useRouter()
  const { setAccessToken, setRefreshToken } = useUser()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const { accessToken, refreshToken } = router.query

    const _accessToken = Array.isArray(accessToken)
      ? accessToken[0]
      : accessToken

    const _refreshToken = Array.isArray(refreshToken)
      ? refreshToken[0]
      : refreshToken

    const setRes = setTokens(
      setAccessToken,
      setRefreshToken,
      _accessToken,
      _refreshToken
    )

    if (!setRes) {
      console.error("Unexpected missing access token after auth success")
      router.push(authStateToRoute(AuthStates.LOGIN))
      return
    }

    authRouter(router, jwtDecode<JWTUserClaims>(_accessToken as string))
  }, [router, setAccessToken, setRefreshToken])

  if (typeof window === "undefined") {
    return null
  }

  return null
}

export default AuthSuccess
