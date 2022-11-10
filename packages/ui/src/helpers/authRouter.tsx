import { GetUserResponseDto } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import { NextRouter } from "next/router"

import { JWTUserClaims } from "src/hooks/useUser"
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
      if (isProd) {
        return "/soon"
      } else {
        return "/home"
      }
  }
}

export function authRouter(
  route: (path: string) => boolean,
  jwt?: JWTUserClaims | string | null,
  routeOnlyIfAuth = false,
  searchParams: string[][] | null = null
): boolean {
  if (typeof jwt === "string") {
    jwt = jwtDecode<JWTUserClaims>(jwt)
  }

  const state = authStateMachine(jwt)

  if (routeOnlyIfAuth && state === AuthStates.LOGIN) {
    return false
  }

  let url = authStateToRoute(state)

  if (searchParams) {
    url += "?" + new URLSearchParams(searchParams).toString()
  }

  return route(url)
}

export function redirectUnauthedToLogin(
  user: GetUserResponseDto | undefined,
  router: NextRouter
) {
  if (!user) {
    router.push(authStateToRoute(AuthStates.LOGIN))
    return true
  }
  return false
}
