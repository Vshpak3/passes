import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUser } from "src/hooks/useUser"

const Logout = () => {
  const router = useRouter()
  const { logout } = useUser()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    logout()

    router.push("/login")
  }, [router, logout])

  return null
}

export default Logout // no WithNormalPageLayout
