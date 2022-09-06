import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class FanWallCommentDto {
  @IsUUID()
  @ApiProperty()
  fanWallCommentId: string

  @IsUUID()
  @ApiProperty()
  creatorId: string

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

  constructor(fanWallPost) {
    this.fanWallCommentId = fanWallPost.id
    this.creatorId = fanWallPost.post_id
    this.commenterId = fanWallPost.commenter_id
    this.text = fanWallPost.text
    this.commenterUsername = fanWallPost.commenter_username
    this.commenterDisplayName = fanWallPost.commenter_display_name
    this.createdAt = fanWallPost.created_at
  }
}
