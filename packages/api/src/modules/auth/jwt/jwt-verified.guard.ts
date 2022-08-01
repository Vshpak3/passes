import { ForbiddenException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtVerifiedGuard extends AuthGuard('jwt-verified') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new ForbiddenException('INCOMPLETE_PROFILE')
    }
    return user
  }
}
