import { PickType } from '@nestjs/swagger'

import { UserDto } from '../../user/dto/user.dto'

export class CreateUserRequestDto extends PickType(UserDto, [
  'birthday',
  'countryCode',
  'legalFullName',
  'username',
]) {}
