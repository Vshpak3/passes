import { OmitType } from '@nestjs/swagger'

import { CreateFollowingRequestDto } from './create-following.dto'

export class UpdateFollowingResponseDto extends OmitType(
  CreateFollowingRequestDto,
  ['creatorUserId'] as const,
) {}
