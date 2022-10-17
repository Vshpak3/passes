import { HttpStatus } from '@nestjs/common'
import Request from 'express'
import jwt from 'jsonwebtoken'
import { Strategy } from 'passport-strategy'

import { BASE_CLAIMS } from './jwt.constants'

interface JwtFromRequestFunction {
  (req: Request): string | null
}

interface StrategyOptions {
  secret: string
  jwtFromRequest: JwtFromRequestFunction
  // Verify that the JWT has each of these fields set to corresponding
  // value in order to successfully auth.
  verifyJwtField?: Record<string, any>
  // This option is used for out public endpoints. There is sometimes a need
  // to return express information if there is in fact an auth'd user hitting
  // the endpoint. If set we skip failing on failed auth and return the
  // jwt payload if there is indeed successful auth.
  skipAuth?: boolean
}

interface VerifiedCallback {
  (error: any, user?: any, info?: any): void
}

interface VerifyCallback {
  (payload: any, done: VerifiedCallback): void
}

export const JWT_VERIFY_OPTIONS = {
  ignoreExpiration: false,
  audience: BASE_CLAIMS.aud,
  issuer: BASE_CLAIMS.iss,
}

export class JwtStrategy extends Strategy {
  private name: string // set by PassportStrategy mixin
  private verify: VerifyCallback
  private secret: string
  private jwtFromRequest: JwtFromRequestFunction
  private verifyJwtField: Record<string, any>
  private skipAuth: boolean

  constructor(options: StrategyOptions, verify: VerifyCallback) {
    super()

    this.secret = options.secret
    this.jwtFromRequest = options.jwtFromRequest
    this.verifyJwtField = options.verifyJwtField || {}
    this.skipAuth = !!options.skipAuth
    this.verify = verify
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity, @typescript-eslint/no-unused-vars
  authenticate(req, options): void {
    // Needed to access this inside callback so alias it as self
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    const token = self.jwtFromRequest(req)

    // After the user defined this.verify callback runs, this is the final
    // callback function to finish the auth
    const finalCallback = (err, user, info) => {
      if (err) {
        return self.error(err)
      } else if (!user && !self.skipAuth) {
        return self.fail(info)
      } else {
        return self.success(user || {}, info)
      }
    }

    if (!token) {
      if (self.skipAuth) {
        return self.verify({}, finalCallback)
      } else {
        return self.fail(new Error('No auth token'), HttpStatus.UNAUTHORIZED)
      }
    }

    jwt.verify(
      token,
      self.secret,
      JWT_VERIFY_OPTIONS,
      function (jwt_err, payload) {
        if (jwt_err) {
          if (self.skipAuth) {
            return self.verify(payload, finalCallback)
          } else {
            return self.fail(jwt_err, HttpStatus.UNAUTHORIZED)
          }
        } else {
          for (const [key, value] of Object.entries(self.verifyJwtField)) {
            if (!payload || value !== payload[key]) {
              return self.fail(
                new Error(`Incorrect key ${key}`),
                HttpStatus.FORBIDDEN,
              )
            }
          }

          try {
            self.verify(payload, finalCallback)
          } catch (ex) {
            self.error(ex)
          }
        }
      },
    )
  }
}
