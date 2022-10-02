import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwtFromAuthHeaderWithScheme } from '../jwt.header'
import { JwtAuthPayload } from '../jwt.payload'
import { JwtStrategy } from '../jwt.strategy'
import { JWT_NO_AUTH_NAME } from './jwt-no-auth.constants'

@Injectable()
export class JwtNoAuthStrategy extends PassportStrategy(
  JwtStrategy,
  JWT_NO_AUTH_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secret: configService.get<string>('jwt.authSecret'),
      jwtFromRequest: ExtractJwtFromAuthHeaderWithScheme(),
      skipAuth: true,
    })
  }

  async validate(payload?: JwtAuthPayload) {
    return payload ? { id: payload.sub } : null
  }
}
