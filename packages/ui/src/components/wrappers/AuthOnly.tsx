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

  const safePushUrl = (url: string) => {
    if (router.pathname === url) {
      return
    }

    router.push(url)
  }

  if (loading || !router.isReady) {
    return null
  }

  if (!user) {
    if (isPage && typeof window !== "undefined") {
      safePushUrl("/login")
    }
    return null
  }

  if (isPage && !user.email && !allowEmailUnverified) {
    safePushUrl("/signup/user-email")
    return null
  }

  const decodedAuthToken = jwtDecode(accessToken) as any

  if (isPage && !decodedAuthToken.isEmailVerified && !allowEmailUnverified) {
    safePushUrl("/signup/user-email")
    return null
  }

  if (isPage && !decodedAuthToken.isVerified && !allowUnverified) {
    safePushUrl("/signup/user-info")
    return null
  }

  return <>{children}</>
}

export default AuthOnlyWrapper
