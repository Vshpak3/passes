import { ApiProperty } from '@nestjs/swagger'

export class GetCommentDto {
  @ApiProperty()
  commentId: string

  @ApiProperty()
  postId: string

  @ApiProperty()
  commenterId: string

  @ApiProperty()
  content: string

  constructor(commentEntity) {
    this.commentId = commentEntity.id
    this.postId = commentEntity.post_id
    this.commenterId = commentEntity.commenter_id
    this.content = commentEntity.content
  }
}
