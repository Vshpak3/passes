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

  @DtoProperty({ type: 'string', optional: true })
  signedThumbnailUrl?: string

  @DtoProperty({ custom_type: ContentTypeEnum })
  contentType: ContentTypeEnum

  @DtoProperty({ type: 'date', optional: true })
  createdAt?: Date

  @DtoProperty({ type: 'date', optional: true, nullable: true })
  deletedAt?: Date | null

  @DtoProperty({ type: 'boolean', optional: true })
  inPost?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  inMessage?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  processed?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  failed?: boolean

  constructor(
    content: ContentEntity,
    signedUrl?: string,
    signedThumbnailUrl?: string,
  ) {
    if (content) {
      this.contentId = content.id
      this.userId = content.user_id
      this.contentType = content.content_type
      this.signedUrl = signedUrl
      this.signedThumbnailUrl = signedThumbnailUrl
      this.createdAt = content.created_at
      this.inPost = content.in_post
      this.inMessage = content.in_message
      this.processed = content.processed
      this.failed = content.failed
      this.deletedAt = content.deleted_at
    }
  }
}
