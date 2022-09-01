import { useRouter } from "next/router"
import { FC } from "react"

import { PropsWithChildren } from "../../../types"
import { useUser } from "../../hooks"

export interface AuthOnlyWrapperProps {
  // isPage will handle redirecting user to /login if not logged in
  // Otherwise, will conditionally render children
  isPage?: boolean

  // allowUnverified will prevent the /user-info redirect if the user is unverified
  allowUnverified?: boolean
}

const AuthOnlyWrapper: FC<PropsWithChildren<AuthOnlyWrapperProps>> = ({
  children,
  isPage,
  allowUnverified
}) => {
  const { loading, user } = useUser()
  const router = useRouter()

  if (loading || !router.isReady) {
    return null
  }

  if (!user) {
    if (isPage && typeof window !== "undefined") {
      router.push("/login")
    }

    return null
  }

  // TODO: !user.isVerified
  if (!allowUnverified && isPage) {
    router.push(`/signup/user-info?email=${user.email}`)
    return null
  }

  return <>{children}</>
}

export default AuthOnlyWrapper
