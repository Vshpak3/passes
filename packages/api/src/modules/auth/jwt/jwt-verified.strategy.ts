import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPayload } from './jwt-auth.strategy'

@Injectable()
export class JwtVerifiedStrategy extends PassportStrategy(
  Strategy,
  'jwt-verified',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate(payload: JwtPayload) {
    if (!payload.isVerified) {
      return null
    }

    return { id: payload.sub }
  }
}
