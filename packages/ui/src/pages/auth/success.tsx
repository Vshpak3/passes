import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUser } from "src/hooks"

const AuthSuccess = () => {
  const router = useRouter()
  const { setAccessToken, setRefreshToken } = useUser()

  useEffect(() => {
    if (!router.isReady) return

    const accessToken = router.query.accessToken

    if (!accessToken) {
      router.push("/login")
      return
    }

    const token = Array.isArray(accessToken) ? accessToken[0] : accessToken
    setAccessToken(token)

    const _refreshToken = router.query.refreshToken
    const refreshToken = Array.isArray(_refreshToken)
      ? _refreshToken[0]
      : _refreshToken

    if (refreshToken) {
      setRefreshToken(refreshToken)
    }

    const decodedAuthToken = jwtDecode(token) as any
    if (decodedAuthToken.isVerified) {
      router.push("/home")
    } else {
      router.push("/signup/user-info")
    }
  }, [router, setAccessToken, setRefreshToken])

  if (typeof window === "undefined") {
    return null
  }

  return null
}

export default AuthSuccess
