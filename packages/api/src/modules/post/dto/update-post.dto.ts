import { PickType } from '@nestjs/swagger'

import { CreatePostRequestDto } from './create-post.dto'

export class UpdatePostRequestDto extends PickType(CreatePostRequestDto, [
  'text',
  'tags',
  'price',
  'expiresAt',
  'contentIds',
  'previewIndex',
] as const) {}
