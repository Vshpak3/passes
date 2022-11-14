import { FC, PropsWithChildren, useEffect, useState } from "react"

import {
  authRouter,
  authStateMachine,
  AuthStates
} from "src/helpers/authRouter"
import { isProd } from "src/helpers/env"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { useUser } from "src/hooks/useUser"

interface AuthWrapperProps {
  // isPage will handle redirecting user to /login if not logged in;
  // otherwise will conditionally render children
  isPage?: boolean
  skipAuth?: boolean
  creatorOnly?: boolean
  hasRefreshed?: boolean
}

export const AuthWrapper: FC<PropsWithChildren<AuthWrapperProps>> = ({
  children,
  isPage,
  skipAuth,
  creatorOnly,
  hasRefreshed = true
}) => {
  const { userClaims, user } = useUser()
  const { safePush } = useSafeRouter()
  const [authed, setAuthed] = useState(skipAuth)

  useEffect(() => {
    if (!hasRefreshed) {
      return
    }
    if (typeof window === "undefined") {
      return
    }

    if (skipAuth) {
      return
    }

    // DISABLE ALL AUTHED PAGES IN PROD
    if (isProd && !user?.email.endsWith("@passes.com")) {
      setAuthed(false)
      if (isPage) {
        authRouter(safePush, userClaims)
      }
      return
    }

    let _authed = authStateMachine(userClaims) === AuthStates.AUTHED
    if (creatorOnly && !userClaims?.isCreator) {
      _authed = false
    }

    setAuthed(_authed)
    if (isPage && !_authed) {
      authRouter(safePush, userClaims)
    }
  }, [isPage, skipAuth, creatorOnly, userClaims, hasRefreshed, safePush])

  return authed ? <>{children}</> : null
}
