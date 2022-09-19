import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { ALLOW_UNAUTHORIZED_REQUEST } from '../core/auth.metadata'
import { JWT_AUTH_NAME } from './jwt.constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_AUTH_NAME) {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      ALLOW_UNAUTHORIZED_REQUEST,
      context.getHandler(),
    )

    return allowUnauthorizedRequest || super.canActivate(context)
  }
}
