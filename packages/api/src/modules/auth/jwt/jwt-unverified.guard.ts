import { AuthGuard } from '@nestjs/passport'

import { JWT_UNVERIFIED_NAME } from './jwt.constants'

export class JwtUnverifiedGuard extends AuthGuard(JWT_UNVERIFIED_NAME) {}
