import { ApiProperty } from '@nestjs/swagger'

export class CommentDto {
  @ApiProperty()
  commentId: string

  @ApiProperty()
  postId: string

  @ApiProperty()
  commenterId: string

  @ApiProperty()
  content: string

  @ApiProperty()
  commenterUsername: string

  @ApiProperty()
  createdAt: Date

  constructor(comment) {
    this.commentId = comment.id
    this.postId = comment.post_id
    this.commenterId = comment.commenter_id
    this.content = comment.content
    this.commenterUsername = comment.commenter_username
    this.createdAt = comment.created_at
  }
}
