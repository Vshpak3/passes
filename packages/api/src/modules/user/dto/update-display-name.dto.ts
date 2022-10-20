import { PickType } from '@nestjs/swagger'

import { UserDto } from './user.dto'

export class UpdateDisplayNameRequestDto extends PickType(UserDto, [
  'displayName',
]) {}
