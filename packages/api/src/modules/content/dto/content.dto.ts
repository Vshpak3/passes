import { DtoProperty } from '../../../web/dto.web'
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

  @DtoProperty({ type: 'date', optional: true })
  createdAt?: Date

  @DtoProperty({ type: 'boolean', optional: true })
  inPost?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  inMessage?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  processed?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  failed?: boolean

  constructor(content: ContentEntity, signedUrl?: string) {
    if (content) {
      this.contentId = content.id
      this.userId = content.user_id
      this.contentType = content.content_type
      this.signedUrl = signedUrl
      this.createdAt = content.created_at
      this.inPost = content.in_post
      this.inMessage = content.in_message
      this.processed = content.processed
      this.failed = content.failed
    }
  }
}
