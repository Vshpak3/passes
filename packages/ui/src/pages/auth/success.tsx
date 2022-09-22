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

    let { accessToken, refreshToken } = router.query

    accessToken = Array.isArray(accessToken)
      ? accessToken[0]
      : (accessToken as string)

    refreshToken = Array.isArray(refreshToken)
      ? refreshToken[0]
      : (refreshToken as string)

    const setRes = setTokens(
      { accessToken, refreshToken },
      setAccessToken,
      setRefreshToken
    )

    if (!setRes) {
      console.error("Unexpected missing access token after auth success")
      router.push(authStateToRoute(AuthStates.LOGIN))
      return
    }

    authRouter(router, jwtDecode<JWTUserClaims>(accessToken))
  }, [router, setAccessToken, setRefreshToken])

  if (typeof window === "undefined") {
    return null
  }

  return null
}

export default AuthSuccess
