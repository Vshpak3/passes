import { PickType } from '@nestjs/swagger'

import { UserDto } from './user.dto'

export class UpdateUsernameRequestDto extends PickType(UserDto, ['username']) {}
