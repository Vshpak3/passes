import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserEntity } from '../../user/entities/user.entity'
import { BASE_CLAIMS } from './jwt.constants'
import { JwtPayload } from './jwt-auth.strategy'

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(user: UserEntity) {
    const payload: JwtPayload = {
      sub: user.id,
      isVerified: this.isVerified(user),
      isCreator: user.isCreator,
      ...BASE_CLAIMS,
    }
    return this.jwtService.sign(payload)
  }

  public isVerified(user: UserEntity): boolean {
    return (
      !!user.email &&
      !!user.legalFullName &&
      !!user.birthday &&
      !!user.countryCode
    )
  }
}
