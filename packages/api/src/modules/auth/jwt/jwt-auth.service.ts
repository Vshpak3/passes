import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthRecord } from '../core/auth-record'
import { BASE_CLAIMS } from './jwt.constants'
import { JwtAuthPayload } from './jwt.payload'

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(authRecord: AuthRecord): string {
    const payload: JwtAuthPayload = {
      sub: authRecord.id,
      isEmailVerified: authRecord.isEmailVerified,
      isVerified: !!authRecord.isVerified,
      isCreator: !!authRecord.isCreator,
      ...BASE_CLAIMS,
    }
    return this.jwtService.sign(payload)
  }
}
