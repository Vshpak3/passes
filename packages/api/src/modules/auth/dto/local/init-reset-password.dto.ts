import { PickType } from '@nestjs/swagger'

import { LocalUserDto } from './local-user.dto'

export class InitResetPasswordRequestDto extends PickType(LocalUserDto, [
  'email',
]) {}
