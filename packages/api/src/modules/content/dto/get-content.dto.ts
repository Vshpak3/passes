import { ApiProperty } from '@nestjs/swagger'

export class GetContentDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  url: string

  @ApiProperty()
  contentType: string

  constructor(id: string, url: string, contentType: string) {
    this.id = id
    this.url = url
    this.contentType = contentType
  }
}
