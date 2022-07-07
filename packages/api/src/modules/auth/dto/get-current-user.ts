import { JwtPayload } from '../jwt/jwt-auth.strategy'

export class GetCurrentUserDto {
  user: JwtPayload
}
