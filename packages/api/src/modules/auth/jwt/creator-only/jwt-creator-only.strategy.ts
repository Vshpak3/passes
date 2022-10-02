import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwtFromAuthHeaderWithScheme } from '../jwt.header'
import { JwtAuthPayload } from '../jwt.payload'
import { JwtStrategy } from '../jwt.strategy'
import { JWT_CREATOR_ONLY_NAME } from './jwt-creator-only.constants'

@Injectable()
export class JwtCreatorOnlyStrategy extends PassportStrategy(
  JwtStrategy,
  JWT_CREATOR_ONLY_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secret: configService.get<string>('jwt.authSecret'),
      jwtFromRequest: ExtractJwtFromAuthHeaderWithScheme(),
      verifyJwtField: { isCreator: true },
    })
  }

  async validate(payload: JwtAuthPayload) {
    return { id: payload.sub }
  }
}
