import { OmitType } from '@nestjs/swagger'

import { CreateFollowingDto } from './create-following.dto'

export class UpdateFollowingDto extends OmitType(CreateFollowingDto, [
  'creatorUserId',
] as const) {}
