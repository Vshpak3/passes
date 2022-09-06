import { DtoProperty } from '../../../web/dto.web'
import { JwtPayload } from '../jwt/jwt-auth.strategy'

export class GetCurrentUserDto {
  @DtoProperty()
  user: JwtPayload
}
