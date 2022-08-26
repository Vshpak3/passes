import { ApiProperty } from '@nestjs/swagger'

export class ContentDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  url: string

  @ApiProperty()
  contentType: string

  constructor(content) {
    this.id = content.id
    this.createdAt = content.created_at
    this.updatedAt = content.updated_at
    this.url = content.url
    this.contentType = content.content_type
  }
}
