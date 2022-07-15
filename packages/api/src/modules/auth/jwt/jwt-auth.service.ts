import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { BASE_CLAIMS } from './jwt.constants'
import { JwtPayload } from './jwt-auth.strategy'

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(userId: string) {
    const payload: JwtPayload = { sub: userId, ...BASE_CLAIMS }
    return this.jwtService.sign(payload)
  }
}
