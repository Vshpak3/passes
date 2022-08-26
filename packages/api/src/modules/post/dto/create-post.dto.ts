import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { ContentDto } from '../../content/dto/content.dto'
import { POST_CONTENT_LENGTH } from '../constants/schema'

export class CreatePostRequestDto {
  @ApiProperty()
  @Length(1, POST_CONTENT_LENGTH)
  text: string

  @ApiProperty({ type: [ContentDto] })
  content: ContentDto[]

  @ApiProperty()
  passes: string[]

  @ApiProperty()
  private: boolean
}
