import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from './post.dto'

export class CreatePostRequestDto extends PickType(PostDto, [
  'text',
  'tags',
  'passIds',
  'price',
  'expiresAt',
  'previewIndex',
]) {
  @DtoProperty({ type: 'uuid[]' })
  contentIds: string[]

  @DtoProperty({ type: 'date', optional: true })
  scheduledAt?: Date
}

export class CreatePostResponseDto {
  @DtoProperty({ type: 'uuid', optional: true })
  postId?: string
}
