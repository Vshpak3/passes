import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CommentDto {
  @IsUUID()
  @ApiProperty()
  commentId: string

  @IsUUID()
  @ApiProperty()
  postId: string

  @IsUUID()
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
