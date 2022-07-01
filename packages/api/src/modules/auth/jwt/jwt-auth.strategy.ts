import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Strategy } from 'passport-jwt'

export type JwtPayload = { sub: string }

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const extractJwtFromCookie = (req) => {
      let token = null

      if (req && req.cookies) {
        token = req.cookies['session']
      }

      return token
    }

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub }
  }
}
