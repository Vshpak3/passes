import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-auth.strategy'
import { UserEntity } from '../../user/entities/user.entity'

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: UserEntity) {
    const payload: JwtPayload = { sub: user.id }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
