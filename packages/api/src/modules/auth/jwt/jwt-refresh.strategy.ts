import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ApiProperty } from '@nestjs/swagger'
import { ExtractJwt, Strategy } from 'passport-jwt'

export class JwtPayload {
  @ApiProperty()
  sub: string
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
    })
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub }
  }
}
