import { IsUUID, Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { FAN_COMMENT_TEXT_LENGTH } from '../constants/schema'

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

  @Length(1, FAN_COMMENT_TEXT_LENGTH)
  @DtoProperty()
  text: string

  @DtoProperty()
  tags: TagDto[]

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty()
  commenterUsername: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
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
    this.tags = JSON.parse(fanWallPost.tags)
  }
}
