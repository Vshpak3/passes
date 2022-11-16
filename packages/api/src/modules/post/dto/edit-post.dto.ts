import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { CreatePostRequestDto } from './create-post.dto'

export class EditPostRequestDto extends PickType(CreatePostRequestDto, [
  'text',
  'tags',
  'price',
  'expiresAt',
  'contentIds',
  'previewIndex',
] as const) {
  @DtoProperty({ type: 'uuid' })
  postId: string
}
