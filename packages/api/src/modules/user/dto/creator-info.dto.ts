import { PickType } from '@nestjs/swagger'

import { UserDto } from './user.dto'

/**
 * This will be returned to any user who searches so we need to ensure it
 * contains no private user information.
 */
export class CreatorInfoDto extends PickType(UserDto, [
  'id',
  'username',
  'displayName',
]) {}
