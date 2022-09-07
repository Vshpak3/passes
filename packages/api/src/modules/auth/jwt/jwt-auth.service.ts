import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserDto } from '../../user/dto/user.dto'
import { BASE_CLAIMS } from './jwt.constants'
import { JwtPayload } from './jwt-auth.strategy'

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(user: UserDto) {
    const payload: JwtPayload = {
      sub: user.id,
      isVerified: this.isVerified(user),
      isCreator: !!user.isCreator,
      isEmailVerified: !!user.isEmailVerified,
      ...BASE_CLAIMS,
    }
    return this.jwtService.sign(payload)
  }

  public isVerified(user: UserDto): boolean {
    return (
      !!user.email &&
      !!user.legalFullName &&
      !!user.birthday &&
      !!user.countryCode
    )
  }
}
