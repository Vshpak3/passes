import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JWT_UNVERIFIED_NAME } from './jwt.constants'
import { JwtAuthPayload } from './jwt.payload'

@Injectable()
export class JwtUnverifiedStrategy extends PassportStrategy(
  Strategy,
  JWT_UNVERIFIED_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.authSecret'),
    })
  }

  async validate(payload: JwtAuthPayload) {
    if (payload.isVerified) {
      throw new UnauthorizedException('User is verified')
    }
    return { id: payload.sub }
  }
}
