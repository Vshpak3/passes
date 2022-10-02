import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { JWT_NO_AUTH_NAME } from './jwt-no-auth.constants'

@Injectable()
export class JwtNoAuthGuard extends AuthGuard(JWT_NO_AUTH_NAME) {}
