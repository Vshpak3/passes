import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { JWT_CREATOR_ONLY_NAME } from './jwt-creator-only.constants'

@Injectable()
export class JwtCreatorOnlyGuard extends AuthGuard(JWT_CREATOR_ONLY_NAME) {}
