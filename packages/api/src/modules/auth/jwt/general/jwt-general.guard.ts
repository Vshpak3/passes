import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { JWT_GENERAL_NAME } from './jwt-general.constants'

@Injectable()
export class JwtGeneralGuard extends AuthGuard(JWT_GENERAL_NAME) {}
