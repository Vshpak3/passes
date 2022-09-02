import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CommentDto } from './comment.dto'

export class GetCommentsForPostResponseDto {
  @IsUUID()
  @ApiProperty()
  postId: string

  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[]

  constructor(postId, commentEntities) {
    this.postId = postId
    this.comments = commentEntities.map((c) => new CommentDto(c))
  }
}
