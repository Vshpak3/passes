import { PickType } from '@nestjs/swagger'

import { CreateUserDto } from './create-user.dto'

export class UpdateDisplayNameRequestDto extends PickType(CreateUserDto, [
  'displayName',
]) {}
