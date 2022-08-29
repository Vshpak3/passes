import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { POST_CONTENT_LENGTH } from '../constants/schema'

export class CreatePostRequestDto {
  @ApiProperty()
  @Length(1, POST_CONTENT_LENGTH)
  text: string

  @ApiProperty()
  content: string[]

  @ApiProperty()
  passes: string[]

  @ApiProperty()
  private: boolean
}
