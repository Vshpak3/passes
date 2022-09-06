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
  text: string

  @ApiProperty()
  commenterUsername: string

  @ApiProperty()
  commenterDisplayName: string

  @ApiProperty()
  createdAt: Date

  constructor(comment) {
    this.commentId = comment.id
    this.postId = comment.post_id
    this.commenterId = comment.commenter_id
    this.text = comment.text
    this.commenterUsername = comment.commenter_username
    this.commenterDisplayName = comment.commenter_display_name
    this.createdAt = comment.created_at
  }
}
