import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { JWT_REFRESH_NAME } from './jwt.constants'

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_NAME) {}
