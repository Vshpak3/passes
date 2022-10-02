import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService as NestJwtService } from '@nestjs/jwt'

import { AuthRecord } from '../core/auth-record'
import { jwtAuthConfig, jwtRefreshConfig } from './jwt.config'
import { BASE_CLAIMS } from './jwt.constants'
import { JwtAuthPayload, JwtRefreshPayload } from './jwt.payload'

@Injectable()
export class JwtService {
  private jwtAuthService: NestJwtService
  private jwtRefreshService: NestJwtService

  constructor(private readonly configService: ConfigService) {
    this.jwtAuthService = new NestJwtService(
      jwtAuthConfig.useFactory(this.configService),
    )

    this.jwtRefreshService = new NestJwtService(
      jwtRefreshConfig.useFactory(this.configService),
    )
  }

  createAccessToken(authRecord: AuthRecord): string {
    const payload: JwtAuthPayload = {
      sub: authRecord.id,
      isEmailVerified: authRecord.isEmailVerified,
      isVerified: !!authRecord.isVerified,
      isCreator: !!authRecord.isCreator,
      ...BASE_CLAIMS,
    }
    return this.jwtAuthService.sign(payload)
  }

  createRefreshToken(authRecord: AuthRecord) {
    const payload: JwtRefreshPayload = {
      sub: authRecord.id,
      ...BASE_CLAIMS,
    }
    return this.jwtRefreshService.sign(payload)
  }
}
