import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { DtoProperty } from '../../../web/dto.web'

export class JwtPayload {
  @DtoProperty()
  sub: string

  @DtoProperty({ optional: true })
  email?: string

  @DtoProperty()
  isVerified: boolean

  @DtoProperty()
  isEmailVerified: boolean

  @DtoProperty()
  isCreator: boolean
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub }
  }
}
