import { Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { FAN_COMMENT_TEXT_LENGTH } from '../constants/schema'
import { FanWallCommentEntity } from '../entities/fan-wall-comment.entity'

export class FanWallCommentDto {
  @DtoProperty({ type: 'uuid' })
  fanWallCommentId: string

  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @DtoProperty({ type: 'uuid' })
  commenterId: string

  @Length(1, FAN_COMMENT_TEXT_LENGTH)
  @DtoProperty({ type: 'string' })
  text: string

  @DtoProperty({ custom_type: [TagDto] })
  tags: TagDto[]

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string' })
  commenterUsername: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  commenterDisplayName: string

  @DtoProperty({ type: 'date' })
  createdAt: Date

  constructor(
    fanWallPost: FanWallCommentEntity & {
      commenter_username: string
      commenter_display_name: string
    },
  ) {
    this.fanWallCommentId = fanWallPost.id
    this.creatorId = fanWallPost.creator_id
    this.commenterId = fanWallPost.commenter_id
    this.text = fanWallPost.text
    this.commenterUsername = fanWallPost.commenter_username
    this.commenterDisplayName = fanWallPost.commenter_display_name
    this.createdAt = fanWallPost.created_at
    this.tags = JSON.parse(fanWallPost.tags)
  }
}
