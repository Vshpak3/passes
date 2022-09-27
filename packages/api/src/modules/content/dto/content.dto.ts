import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class ContentDto {
  @DtoProperty({ type: 'uuid' })
  contentId: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @DtoProperty({ type: 'string' })
  signedUrl: string

  @DtoProperty({ custom_type: ContentTypeEnum })
  contentType: ContentTypeEnum

  @Min(0)
  @DtoProperty({ type: 'number' })
  order: number

  @DtoProperty({ type: 'date' })
  createdAt: Date

  constructor(content, signedUrl) {
    if (content) {
      this.contentId = content.id
      this.userId = content.user_id
      this.signedUrl = content.url
      this.contentType = content.content_type
      this.signedUrl = signedUrl
      this.order = content.order
      this.createdAt = content.created_at
    }
  }
}
