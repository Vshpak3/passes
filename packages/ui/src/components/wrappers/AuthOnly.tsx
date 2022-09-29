import { useRouter } from "next/router"
import { FC } from "react"

import { PropsWithChildren } from "../../../types"
import {
  authRouter,
  authStateMachine,
  AuthStates
} from "../../helpers/authRouter"
import { useUser } from "../../hooks"

export interface AuthOnlyWrapperProps {
  // isPage will handle redirecting user to /login if not logged in;
  // otherwise will conditionally render children
  isPage?: boolean
}

const AuthOnlyWrapper: FC<PropsWithChildren<AuthOnlyWrapperProps>> = ({
  children,
  isPage
}) => {
  const { userClaims } = useUser()
  const router = useRouter()

  if (!router.isReady) {
    return null
  }

  if (typeof window === "undefined") {
    return null
  }

  if (authStateMachine(userClaims) !== AuthStates.AUTHED) {
    if (isPage && typeof window !== "undefined") {
      authRouter(router, userClaims)
    }

    return null
  }

  return <>{children}</>
}

export default AuthOnlyWrapper
