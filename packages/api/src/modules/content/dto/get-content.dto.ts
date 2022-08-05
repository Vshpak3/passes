import { ApiProperty } from '@nestjs/swagger'

export class GetContentDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  postId: string

  @ApiProperty()
  url: string

  @ApiProperty()
  contentType: string

  constructor(contentEntity) {
    this.id = contentEntity.id
    this.postId = contentEntity.post_id
    this.url = contentEntity.url
    this.contentType = contentEntity.content_type
  }
}
