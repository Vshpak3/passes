import { useRouter } from "next/router"
import { useEffect } from "react"

import { useUser } from "../hooks"

const Logout = () => {
  const router = useRouter()
  const { user, logout } = useUser()

  useEffect(() => {
    if (!router.isReady || user) {
      return
    }

    logout()
    router.push("/login")
  }, [router, user, logout])

  if (typeof window === "undefined") {
    return null
  }

  return null
}

export default Logout
