import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwtFromAuthHeaderWithScheme } from '../jwt.header'
import { JwtAuthPayload } from '../jwt.payload'
import { JwtStrategy } from '../jwt.strategy'
import { JWT_GENERAL_NAME } from './jwt-general.constants'

@Injectable()
export class JwtGeneralStrategy extends PassportStrategy(
  JwtStrategy,
  JWT_GENERAL_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secret: configService.get<string>('jwt.authSecret'),
      jwtFromRequest: ExtractJwtFromAuthHeaderWithScheme(),
    })
  }

  async validate(payload: JwtAuthPayload) {
    return { id: payload.sub }
  }
}
