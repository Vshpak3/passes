import { ApiProperty } from '@nestjs/swagger'

import { ContentEntity } from '../entities/content.entity'

export class GetContentDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  postId: string

  @ApiProperty()
  url: string

  @ApiProperty()
  contentType: string

  constructor(contentEntity: ContentEntity) {
    this.id = contentEntity.id
    this.postId = contentEntity.post.id
    this.url = contentEntity.url
    this.contentType = contentEntity.contentType
  }
}
