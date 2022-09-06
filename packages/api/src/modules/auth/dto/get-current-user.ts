import { DtoProperty } from '../../../web/endpoint.web'
import { JwtPayload } from '../jwt/jwt-auth.strategy'

export class GetCurrentUserDto {
  @DtoProperty()
  user: JwtPayload
}
