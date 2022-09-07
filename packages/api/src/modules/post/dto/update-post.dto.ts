import { PickType } from '@nestjs/swagger'

import { CreatePostRequestDto } from './create-post.dto'

export class UpdatePostRequestDto extends PickType(CreatePostRequestDto, [
  'text',
  'price',
  'expiresAt',
] as const) {}
