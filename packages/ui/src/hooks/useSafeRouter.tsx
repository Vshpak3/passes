import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

/**
 * Ensures we don't route while the route is already changing.
 *
 * https://github.com/vercel/next.js/discussions/39040
 */
export const useSafeRouter = () => {
  const [isChanging, setIsChanging] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      setIsChanging(true)
    }
    const handleStop = () => {
      setIsChanging(false)
    }

    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleStop)
    router.events.on("routeChangeError", handleStop)

    return () => {
      router.events.off("routeChangeStart", handleStart)
      router.events.off("routeChangeComplete", handleStop)
      router.events.off("routeChangeError", handleStop)
    }
  }, [router])

  const safePush = useCallback(
    (path: string) => {
      if (!router.isReady || isChanging || router.pathname === path) {
        return false
      }
      router.push(path)
      return true
    },
    [isChanging, router]
  )

  return { isChanging, safePush }
}
