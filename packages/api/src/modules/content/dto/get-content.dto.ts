import { ApiProperty } from '@nestjs/swagger'

export class GetContentDto {
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

  constructor(contentEntity) {
    this.id = contentEntity.id
    this.createdAt = contentEntity.created_at
    this.updatedAt = contentEntity.updated_at
    this.url = contentEntity.url
    this.contentType = contentEntity.content_type
  }
}
