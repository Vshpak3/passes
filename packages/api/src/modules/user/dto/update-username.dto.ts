import { PickType } from '@nestjs/swagger'

import { CreateUserRequestDto } from './create-user.dto'

export class UpdateUsernameRequestDto extends PickType(CreateUserRequestDto, [
  'username',
]) {}
