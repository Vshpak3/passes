import { useRouter } from "next/router"
import { useEffect } from "react"

import useUser from "../../hooks/useUser"

const AuthSuccess = () => {
  const router = useRouter()
  const { setAccessToken } = useUser()

  useEffect(() => {
    if (!router.isReady) return

    const accessToken = router.query.accessToken

    if (!accessToken) {
      router.push("/login")
      return
    }

    const token = Array.isArray(accessToken) ? accessToken[0] : accessToken
    setAccessToken(token)

    router.push("/profile/toshi")
  }, [router, setAccessToken])

  if (typeof window === "undefined") {
    return null
  }

  return null
}

export default AuthSuccess
