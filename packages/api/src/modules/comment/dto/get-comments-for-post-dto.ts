import { ApiProperty } from '@nestjs/swagger'

import { GetCommentDto } from './get-comment.dto'

export class GetCommentsForPostDto {
  @ApiProperty()
  postId: string

  @ApiProperty({ type: [GetCommentDto] })
  comments: GetCommentDto[]

  constructor(postId, commentEntities) {
    this.postId = postId
    this.comments = commentEntities.map((c) => new GetCommentDto(c))
  }
}
