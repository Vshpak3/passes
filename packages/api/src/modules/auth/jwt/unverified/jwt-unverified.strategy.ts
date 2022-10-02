import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { JwtAuthPayload } from '../jwt.payload'
import { JwtStrategy } from '../jwt.strategy'
import { JWT_UNVERIFIED_NAME } from './jwt-unverified.constants'

@Injectable()
export class JwtUnverifiedStrategy extends PassportStrategy(
  JwtStrategy,
  JWT_UNVERIFIED_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({ secret: configService.get<string>('jwt.authSecret') })
  }

  async validate(payload: JwtAuthPayload) {
    return { id: payload.sub }
  }
}
