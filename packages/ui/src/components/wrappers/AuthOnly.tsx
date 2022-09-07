import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import { FC } from "react"

import { PropsWithChildren } from "../../../types"
import { useUser } from "../../hooks"

export interface AuthOnlyWrapperProps {
  // isPage will handle redirecting user to /login if not logged in
  // Otherwise, will conditionally render children
  isPage?: boolean

  // allowUnverified will prevent the /user-email redirect if the user is email unverified
  allowEmailUnverified?: boolean

  // allowUnverified will prevent the /user-info redirect if the user is unverified
  allowUnverified?: boolean
}

const AuthOnlyWrapper: FC<PropsWithChildren<AuthOnlyWrapperProps>> = ({
  children,
  isPage,
  allowEmailUnverified,
  allowUnverified
}) => {
  const { loading, user, accessToken } = useUser()
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

  if (isPage && !user.email) {
    router.push(`/signup/user-email`)
    return null
  }

  const decodedAuthToken = jwtDecode(accessToken) as any
  if (isPage) {
    if (!decodedAuthToken.isEmailVerified && !allowEmailUnverified) {
      router.push("/signup/user-email")
      return null
    }

    if (!decodedAuthToken.isVerified && !allowUnverified) {
      router.push("/signup/user-info")
      return null
    }
  }

  return <>{children}</>
}

export default AuthOnlyWrapper
