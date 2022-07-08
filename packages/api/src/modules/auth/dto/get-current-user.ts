import { ApiProperty } from '@nestjs/swagger'

import { JwtPayload } from '../jwt/jwt-auth.strategy'

export class GetCurrentUserDto {
  @ApiProperty()
  user: JwtPayload
}
