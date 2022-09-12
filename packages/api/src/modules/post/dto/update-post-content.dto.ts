import { PickType } from '@nestjs/swagger'

import { CreatePostRequestDto } from './create-post.dto'

export class UpdatePostContentRequestDto extends PickType(
  CreatePostRequestDto,
  ['contentIds'] as const,
) {}
