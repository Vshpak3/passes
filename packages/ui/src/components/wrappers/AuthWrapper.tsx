import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import {
  authRouter,
  authStateMachine,
  AuthStates
} from "src/helpers/authRouter"
import { isProd } from "src/helpers/env"
import { useUser } from "src/hooks/useUser"
import { PropsWithChildren } from "types"

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
  const { user, userClaims } = useUser()
  const router = useRouter()
  const [authed, setAuthed] = useState(skipAuth)

  useEffect(() => {
    if (!hasRefreshed) {
      return
    }
    if (!router.isReady) {
      return
    }
    if (typeof window === "undefined") {
      return
    }

    if (skipAuth) {
      return
    }

    // DISABLE ALL AUTHED PAGES IN PROD
    if (isProd) {
      setAuthed(false)
      if (isPage) {
        authRouter(router, userClaims)
      }
      return
    }

    let _authed = authStateMachine(userClaims) === AuthStates.AUTHED
    if (creatorOnly && user && !user.isCreator) {
      _authed = false
    }

    setAuthed(_authed)
    if (isPage && !_authed) {
      authRouter(router, userClaims)
    }
  }, [isPage, skipAuth, creatorOnly, router, user, userClaims, hasRefreshed])

  return authed ? <>{children}</> : <></>
}
