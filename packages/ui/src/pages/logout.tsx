import { useRouter } from "next/router"

import { useUser } from "../hooks"

const Logout = () => {
  const { loading, user, logout } = useUser()
  const router = useRouter()

  if (loading || !user) {
    return null
  }

  logout()
  router.push("/login")
}

export default Logout
