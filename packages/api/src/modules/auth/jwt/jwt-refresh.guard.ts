import { AuthGuard } from '@nestjs/passport'

import { JWT_REFRESH_NAME } from './jwt.constants'

export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_NAME) {}
