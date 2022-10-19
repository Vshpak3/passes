import { useEffect } from "react"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { useUser } from "src/hooks/useUser"

const Logout = () => {
  const { safePush } = useSafeRouter()
  const { logout } = useUser()

  useEffect(() => {
    logout()

    safePush("/login")
  }, [safePush, logout])

  return null
}

export default Logout // no WithNormalPageLayout
