import { ArrayMaxSize, ArrayMinSize, IsArray, Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import {
  FAN_COMMENT_TAG_MAX_COUNT,
  FAN_COMMENT_TEXT_LENGTH,
} from '../constants/schema'
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

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(FAN_COMMENT_TAG_MAX_COUNT)
  @DtoProperty({ custom_type: [TagDto] })
  tags: TagDto[]

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string' })
  commenterUsername: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  commenterDisplayName: string

  @DtoProperty({ type: 'boolean' })
  commenterIsCreator: boolean

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @DtoProperty({ type: 'boolean' })
  isOwner: boolean

  @DtoProperty({ type: 'boolean' })
  isHidden: boolean

  @DtoProperty({ type: 'date', nullable: true })
  deletedAt: Date | null

  constructor(
    fanWallPost: FanWallCommentEntity & {
      commenter_username: string
      commenter_display_name: string
      commenter_is_creator: boolean
    },
    isOwner?: boolean,
  ) {
    this.fanWallCommentId = fanWallPost.id
    this.creatorId = fanWallPost.creator_id
    this.commenterId = fanWallPost.commenter_id
    this.text = fanWallPost.text
    this.commenterUsername = fanWallPost.commenter_username
    this.commenterDisplayName = fanWallPost.commenter_display_name
    this.commenterIsCreator = fanWallPost.commenter_is_creator
    this.createdAt = fanWallPost.created_at
    this.tags = JSON.parse(fanWallPost.tags)
    this.isOwner = !!isOwner
    this.isHidden = fanWallPost.hidden
    this.deletedAt = fanWallPost.deleted_at
  }
}
