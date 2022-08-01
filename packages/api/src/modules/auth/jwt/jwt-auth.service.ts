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
      ...BASE_CLAIMS,
    }
    return this.jwtService.sign(payload)
  }

  private isVerified(user: UserEntity): boolean {
    // TODO: Add email not verified check (for email password users)

    if (!user.fullName) {
      return false
    }

    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (!user.birthday) {
      return false
    }

    return true
  }
}
