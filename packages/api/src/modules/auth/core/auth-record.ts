import { OmitType } from '@nestjs/swagger'

import { UserDto } from '../../user/dto/user.dto'
import { JwtAuthPayload } from '../jwt/jwt.payload'

/**
 * This is practically the JwtAuthPayload just for internal usage. We also swap
 * out "sub" for "id" since it makes more sense internally.
 */
export class AuthRecord extends OmitType(JwtAuthPayload, ['sub'] as const) {
  id: string

  constructor(init?: Partial<AuthRecord>) {
    super()
    Object.assign(this, init)
  }

  static fromUserDto(userDto: UserDto): AuthRecord {
    return new AuthRecord({
      id: userDto.userId,
      isVerified: true,
      isEmailVerified: true,
      isCreator: userDto.isCreator,
    })
  }
}
