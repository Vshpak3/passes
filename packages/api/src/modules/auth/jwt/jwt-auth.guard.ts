import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import jwtDecode from 'jwt-decode'

import { ROLE_KEY, RoleEnum } from '../core/auth.metadata'
import { JWT_AUTH_NAME } from './jwt.constants'
import { JwtAuthPayload } from './jwt.payload'

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_AUTH_NAME) {
  constructor(private reflector: Reflector) {
    super()
  }g

  canActivate(context: ExecutionContext) {
    const role = this.reflector.get<RoleEnum>(ROLE_KEY, context.getHandler())

    // Before we even bother validating the JWT, if isCreator is false we fail
    // immediately. This isn't the cleanest solution since it involves decoding
    // the JWT twice, but the docs are terrible and I couldn't figure out a
    // better method.
    // if (role === RoleEnum.CREATOR_ONLY) {
    //   const request = context.switchToHttp().getRequest()
    //   if (!request.headers.authorization) {
    //     return false
    //   }
    //   const jwt = jwtDecode<JwtAuthPayload>(request.headers.authorization)
    //   if (!jwt.isCreator) {
    //     return false
    //   }
    // }

    return (
      role === RoleEnum.NO_AUTH ||
      role === RoleEnum.UNVERIFIED ||
      super.canActivate(context)
    )
  }
}
