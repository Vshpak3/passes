import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export const JWT_UNVERIFIED_NAME = 'jwt-unverified'

@Injectable()
export class JwtUnverifiedGuard extends AuthGuard(JWT_UNVERIFIED_NAME) {}
