import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwtFromBodyField } from '../jwt.header'
import { JwtAuthPayload } from '../jwt.payload'
import { JwtStrategy } from '../jwt.strategy'
import { JWT_REFRESH_NAME } from './jwt-refresh.constants'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  JwtStrategy,
  JWT_REFRESH_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secret: configService.get<string>('jwt.refreshSecret'),
      jwtFromRequest: ExtractJwtFromBodyField('refreshToken'),
    })
  }

  async validate(payload: JwtAuthPayload) {
    return { id: payload.sub }
  }
}
