export class JwtBasePayload {
  sub: string
}

export class JwtAuthPayload extends JwtBasePayload {
  isVerified: boolean
  isEmailVerified: boolean
  isCreator: boolean
}

export type JwtRefreshPayload = JwtBasePayload
