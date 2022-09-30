import { NextRouter } from "next/router"

import { JWTUserClaims } from "../hooks/useUser"
import { isProd } from "./env"
import { tokenStillValid } from "./token"

export enum AuthStates {
  LOGIN,
  EMAIL,
  VERIFY,
  AUTHED
}

export function authStateMachine(jwt?: JWTUserClaims | null): AuthStates {
  if (!jwt || !tokenStillValid(jwt)) {
    return AuthStates.LOGIN
  } else if (!jwt.isEmailVerified) {
    return AuthStates.EMAIL
  } else if (!jwt.isVerified) {
    return AuthStates.VERIFY
  } else {
    return AuthStates.AUTHED
  }
}

export function authStateToRoute(state: AuthStates) {
  switch (state) {
    case AuthStates.LOGIN:
      return "/login"
    case AuthStates.EMAIL:
      return "/signup/email"
    case AuthStates.VERIFY:
      return "/signup/info"
    case AuthStates.AUTHED:
      console.log(isProd)
      // eslint-disable-next-line sonarjs/no-gratuitous-expressions, no-constant-condition
      if (true) {
        return "/soon"
      } else {
        return "/home"
      }
  }
}

export function authRouter(
  router: NextRouter,
  jwt?: JWTUserClaims | null,
  routeOnlyIfAuth = false,
  searchParams: URLSearchParams | null = null
): boolean {
  const state = authStateMachine(jwt)

  if (routeOnlyIfAuth && state === AuthStates.LOGIN) {
    return false
  }

  let url = authStateToRoute(state)

  if (router.pathname === url) {
    return false
  }

  if (searchParams) {
    url += "?" + searchParams.toString()
  }

  router.push(url)

  return true
}
