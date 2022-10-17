import { CanActivate, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import jwt from 'jsonwebtoken'
import { Observable } from 'rxjs'

import { JWT_VERIFY_OPTIONS } from './jwt.strategy'

@Injectable()
export class JwtWsGuard implements CanActivate {
  // constructor(private userService: UserService) {}
  secret: string
  constructor(private readonly configService: ConfigService) {
    this.secret = configService.get<string>('jwt.authSecret') as string
  }
  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const token = context.args[0].handshake.auth.Authorization?.split(' ')[1]
    if (!token) {
      return false
    }
    try {
      jwt.verify(token, this.secret, JWT_VERIFY_OPTIONS) as any
    } catch (ex) {
      return false
    }
  }
}
