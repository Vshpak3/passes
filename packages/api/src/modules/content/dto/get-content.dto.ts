import { ApiProperty } from '@nestjs/swagger'

import { ContentDto } from './content.dto'

export class GetContentResponseDto extends ContentDto {}

export class GetContentsResponseDto {
  @ApiProperty({ type: [ContentDto] })
  contents: ContentDto[]

  constructor(contents: ContentDto[]) {
    this.contents = contents
  }
}
