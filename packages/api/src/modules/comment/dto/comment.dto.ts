import { IsUUID } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'

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

  @DtoProperty()
  text: string

  @DtoProperty()
  tags: TagDto[]

  @DtoProperty()
  commenterUsername: string

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
