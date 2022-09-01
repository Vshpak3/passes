import { ApiProperty } from '@nestjs/swagger'

export class CommentDto {
  @ApiProperty()
  fanWallCommentId: string

  @ApiProperty()
  creatorId: string

  @ApiProperty()
  commenterId: string

  @ApiProperty()
  content: string

  @ApiProperty()
  commenterUsername: string

  @ApiProperty()
  createdAt: Date

  constructor(fanWallPost) {
    this.fanWallCommentId = fanWallPost.id
    this.creatorId = fanWallPost.post_id
    this.commenterId = fanWallPost.commenter_id
    this.content = fanWallPost.content
    this.commenterUsername = fanWallPost.commenter_username
    this.createdAt = fanWallPost.created_at
  }
}
