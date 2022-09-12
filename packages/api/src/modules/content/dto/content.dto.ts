import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class ContentDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  signedUrl: string

  @DtoProperty()
  contentType: string

  @DtoProperty()
  order: string

  constructor(content, signedUrl) {
    this.id = content.id
    this.userId = content.user_id
    this.signedUrl = content.url
    this.contentType = content.content_type
    this.signedUrl = signedUrl
    this.order = content.order
  }
}
