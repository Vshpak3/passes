import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { UserDto } from '../../user/dto/user.dto'

export class AuthRecordDto extends PickType(UserDto, [
  'id',
  'isCreator',
  'birthday',
  'countryCode',
  'legalFullName',
] as const) {
  @DtoProperty()
  isEmailVerified: boolean

  constructor(init?: Partial<AuthRecordDto>) {
    super()
    Object.assign(this, init)
  }

  static fromUserDto(userDto: UserDto): AuthRecordDto {
    return new AuthRecordDto({ ...userDto, isEmailVerified: true })
  }
}
