import { IsEnum, IsInt, IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class ContentDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  userId: string

  //TODO: add length validation
  @DtoProperty()
  signedUrl: string

  @IsEnum(ContentTypeEnum)
  @DtoProperty({ enum: ContentTypeEnum })
  contentType: ContentTypeEnum

  @IsInt()
  @Min(0)
  @DtoProperty()
  order: number

  constructor(content, signedUrl) {
    if (content) {
      this.id = content.id
      this.userId = content.user_id
      this.signedUrl = content.url
      this.contentType = content.content_type
      this.signedUrl = signedUrl
      this.order = content.order
    }
  }
}
