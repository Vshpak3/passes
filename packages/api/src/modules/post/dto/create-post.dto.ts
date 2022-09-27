import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from './post.dto'

export class CreatePostRequestDto extends PickType(PostDto, [
  'text',
  'tags',
  'passIds',
  'price',
  'expiresAt',
  'scheduledAt',
]) {
  @DtoProperty({ type: 'uuid[]' })
  contentIds: string[]
}

export class CreatePostResponseDto extends PickType(PostDto, ['postId']) {}
