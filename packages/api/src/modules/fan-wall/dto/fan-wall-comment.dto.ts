import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class FanWallCommentDto {
  @IsUUID()
  @DtoProperty()
  fanWallCommentId: string

  @IsUUID()
  @DtoProperty()
  creatorId: string

  @IsUUID()
  @DtoProperty()
  commenterId: string

  @DtoProperty()
  text: string

  @DtoProperty()
  commenterUsername: string

  @DtoProperty()
  commenterDisplayName: string

  @DtoProperty()
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
