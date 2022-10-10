import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUser } from "src/hooks"

const Logout = () => {
  const router = useRouter()
  const { user, logout } = useUser()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (user) {
      logout()
    }

    router.push("/login")
  }, [router, user, logout])

  if (typeof window === "undefined") {
    return null
  }

  return null
}

export default Logout // no withPageLayout
