import { ApiProperty } from '@nestjs/swagger'

import { ContentTypeEnum } from '../enums/content-type.enum'

export class CreateContentRequestDto {
  @ApiProperty()
  url: string

  @ApiProperty({ enum: ContentTypeEnum })
  contentType: ContentTypeEnum
}
