import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { BASE_CLAIMS } from './jwt.constants'
import { JwtPayload } from './jwt-auth.strategy'

export type JwtRefreshPayload = Omit<JwtPayload, 'isVerified' | 'isCreator'>

@Injectable()
export class JwtRefreshService {
  constructor(private jwtService: JwtService) {}

  createRefreshToken(userId: string) {
    const payload: JwtRefreshPayload = { sub: userId, ...BASE_CLAIMS }
    return this.jwtService.sign(payload)
  }
}
