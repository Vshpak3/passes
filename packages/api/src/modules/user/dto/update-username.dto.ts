import { PickType } from '@nestjs/swagger'

import { CreateUserDto } from './create-user.dto'

export class UpdateUsernameDto extends PickType(CreateUserDto, ['username']) {}
