import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { CommentDto } from './comment.dto'

export class CreateCommentRequestDto extends PickType(CommentDto, [
  'postId',
  'text',
  'tags',
] as const) {}

export class CreateCommentResponseDto {
  @DtoProperty({ type: 'uuid' })
  commentId: string

  constructor(commentId: string) {
    this.commentId = commentId
  }
}
