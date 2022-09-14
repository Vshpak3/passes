import { PickType } from '@nestjs/swagger'

import { UserDto } from '../../user/dto/user.dto'

export class SetEmailRequestDto extends PickType(UserDto, ['email']) {}
