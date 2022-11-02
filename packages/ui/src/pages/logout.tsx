import { useEffect } from "react"

import { useSafeRouter } from "src/hooks/useSafeRouter"
import { useUser } from "src/hooks/useUser"

export function deleteAllCookies() {
  const cookies = document.cookie.split(";")

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

const Logout = () => {
  const { safePush } = useSafeRouter()
  const { logout } = useUser()

  useEffect(() => {
    logout()

    deleteAllCookies()

    safePush("/login")
  }, [safePush, logout])

  return <div className="h-screen w-screen bg-black" />
}

export default Logout // no WithNormalPageLayout
