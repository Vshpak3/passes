import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ContentDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  signedUrl: string

  @ApiProperty()
  contentType: string

  constructor(content, signedUrl) {
    this.id = content.id
    this.userId = content.user_id
    this.signedUrl = content.url
    this.contentType = content.content_type
    this.signedUrl = signedUrl
  }
}
