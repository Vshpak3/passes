import { ApiProperty } from '@nestjs/swagger'

import { ContentType } from '../constants/validation'

export class CreateContentRequestDto {
  @ApiProperty()
  url: string

  @ApiProperty()
  contentType: ContentType
}
