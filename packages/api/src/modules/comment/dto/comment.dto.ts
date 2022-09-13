import { IsUUID, Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { COMMENT_TEXT_LENGTH } from '../constants/schema'

export class CommentDto {
  @IsUUID()
  @DtoProperty()
  commentId: string

  @IsUUID()
  @DtoProperty()
  postId: string

  @IsUUID()
  @DtoProperty()
  commenterId: string

  @Length(1, COMMENT_TEXT_LENGTH)
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

  constructor(comment) {
    this.commentId = comment.id
    this.postId = comment.post_id
    this.commenterId = comment.commenter_id
    this.text = comment.text
    this.commenterUsername = comment.commenter_username
    this.commenterDisplayName = comment.commenter_display_name
    this.createdAt = comment.created_at
    this.tags = JSON.parse(comment.tags)
  }
}
