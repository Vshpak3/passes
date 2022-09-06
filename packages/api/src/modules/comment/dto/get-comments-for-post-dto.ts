import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CommentDto } from './comment.dto'

export class GetCommentsForPostResponseDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @DtoProperty({ type: [CommentDto] })
  comments: CommentDto[]

  constructor(postId, commentEntities) {
    this.postId = postId
    this.comments = commentEntities.map((c) => new CommentDto(c))
  }
}
