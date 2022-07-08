import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ExtractJwt, Strategy } from 'passport-jwt'

export class JwtPayload {
  @ApiProperty()
  sub: string

  @ApiPropertyOptional()
  email?: string
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
