import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthRecord } from '../core/auth-record'
import { BASE_CLAIMS } from './jwt.constants'
import { JwtRefreshPayload } from './jwt-refresh.payload'

@Injectable()
export class JwtRefreshService {
  constructor(private jwtService: JwtService) {}

  createRefreshToken(authRecord: AuthRecord) {
    const payload: JwtRefreshPayload = { sub: authRecord.id, ...BASE_CLAIMS }
    return this.jwtService.sign(payload)
  }
}
