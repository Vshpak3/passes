import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import {
  authRouter,
  authStateMachine,
  AuthStates
} from "src/helpers/authRouter"
import { isProd } from "src/helpers/env"
import { useUser } from "src/hooks"
import { PropsWithChildren } from "types"

interface AuthWrapperProps {
  // isPage will handle redirecting user to /login if not logged in;
  // otherwise will conditionally render children
  isPage?: boolean
  skipAuth?: boolean
}

const AuthWrapper: FC<PropsWithChildren<AuthWrapperProps>> = ({
  children,
  isPage,
  skipAuth
}) => {
  const { userClaims } = useUser()
  const router = useRouter()
  const [authed, setAuthed] = useState(skipAuth)

  useEffect(() => {
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

    const _authed = authStateMachine(userClaims) === AuthStates.AUTHED
    setAuthed(_authed)
    if (isPage && !_authed) {
      authRouter(router, userClaims)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPage, skipAuth])

  return authed ? <>{children}</> : <div />
}

export default AuthWrapper
