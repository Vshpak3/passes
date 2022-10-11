import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import {
  authRouter,
  AuthStates,
  authStateToRoute
} from "src/helpers/authRouter"
import { setTokens } from "src/helpers/setTokens"
import { useUser } from "src/hooks"
import { JWTUserClaims } from "src/hooks/useUser"

const AuthSuccess: FC = () => {
  const router = useRouter()
  const { mutate, setAccessToken, setRefreshToken } = useUser()

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
      router.push(authStateToRoute(AuthStates.LOGIN))
      return
    }

    mutate()

    authRouter(router, jwtDecode<JWTUserClaims>(accessToken))
  }, [router, mutate, setAccessToken, setRefreshToken])

  return null
}

export default AuthSuccess // no WithNormalPageLayout
