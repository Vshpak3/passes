import { Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { COMMENT_TEXT_LENGTH } from '../constants/schema'
import { CommentEntity } from '../entities/comment.entity'

export class CommentDto {
  @DtoProperty({ type: 'uuid' })
  commentId: string

  @DtoProperty({ type: 'uuid' })
  postId: string

  @DtoProperty({ type: 'uuid' })
  commenterId: string

  @Length(1, COMMENT_TEXT_LENGTH)
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

  @DtoProperty({ type: 'boolean' })
  isHidden: boolean

  constructor(
    comment: CommentEntity & {
      commenter_username: string
      commenter_display_name: string
    },
  ) {
    this.commentId = comment.id
    this.postId = comment.post_id
    this.commenterId = comment.commenter_id
    this.text = comment.text
    this.commenterUsername = comment.commenter_username
    this.commenterDisplayName = comment.commenter_display_name
    this.createdAt = comment.created_at
    this.tags = JSON.parse(comment.tags)
    this.isHidden = comment.hidden
  }
}
