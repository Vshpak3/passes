import ms from "ms"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { refreshAccessToken } from "src/helpers/token"
import { useUser } from "./useUser"

// Try to refresh the access token every this many minutes
const CHECK_FOR_AUTH_REFRESH = ms("5 minute")

export const useTokenRefresh = () => {
  const [refresh, setRefresh] = useState(0)
  const [hasRefreshed, setHasRefreshed] = useState(false)

  const router = useRouter()
  const { setAccessToken, mutate, user, accessToken } = useUser()

  // additional mutate on route change due to strange login issues
  // where user change does not globablly propagate
  useEffect(() => {
    if (!user) {
      mutate()
    }
  }, [mutate, router.route, user, accessToken])

  // Refresh once on page load then repeatedly
  useEffect(() => {
    const refreshAuth = async () => {
      await refreshAccessToken()
        .then((r) => {
          if (r) {
            setAccessToken(r)
          }
          return r
        })
        .catch(() => undefined)

      setHasRefreshed(true)
    }

    refreshAuth()
    const interval = setInterval(async () => {
      refreshAuth()
      setRefresh(refresh + 1)
    }, CHECK_FOR_AUTH_REFRESH)

    return () => clearInterval(interval)
  }, [mutate, refresh, router, setAccessToken])

  return { hasRefreshed, mutate, user, router }
}
