import { Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import { COMMENT_TEXT_LENGTH } from '../constants/schema'

export class CreateCommentRequestDto {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @Length(1, COMMENT_TEXT_LENGTH)
  @DtoProperty({ type: 'string' })
  text: string

  @DtoProperty({ custom_type: [TagDto] })
  tags: TagDto[]
}

export class CreateCommentResponseDto {
  @DtoProperty({ type: 'uuid' })
  commentId: string

  constructor(commentId: string) {
    this.commentId = commentId
  }
}
