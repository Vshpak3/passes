import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PostContentEntity } from '../../post/entities/post-content.entity'
import { ContentEntity } from '../entities/content.entity'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class ContentDto {
  @DtoProperty({ type: 'uuid' })
  contentId: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @DtoProperty({ type: 'string', optional: true })
  signedUrl?: string

  @DtoProperty({ custom_type: ContentTypeEnum })
  contentType: ContentTypeEnum

  @Min(0)
  @DtoProperty({ type: 'number' })
  index: number

  @DtoProperty({ type: 'date' })
  createdAt: Date

  constructor(
    content: ContentEntity & Partial<PostContentEntity>,
    signedUrl?: string,
  ) {
    if (content) {
      this.contentId = content.id
      this.userId = content.user_id
      this.contentType = content.content_type
      this.signedUrl = signedUrl
      this.createdAt = content.created_at
      if (content.index) {
        this.index = content.index
      }
    }
  }
}
