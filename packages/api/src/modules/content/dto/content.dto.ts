import { IsEnum, IsInt, IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class ContentDto {
  @IsUUID()
  @DtoProperty()
  contentId: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  signedUrl: string

  @IsEnum(ContentTypeEnum)
  @DtoProperty({ enum: ContentTypeEnum })
  contentType: ContentTypeEnum

  @IsInt()
  @Min(0)
  @DtoProperty()
  order: number

  @DtoProperty()
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
