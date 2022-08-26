import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { CreateContentDto } from '../../content/dto/create-content.dto'
import { POST_CONTENT_LENGTH } from '../constants/schema'

export class CreatePostDto {
  @ApiProperty()
  @Length(1, POST_CONTENT_LENGTH)
  text: string

  @ApiProperty({ type: [CreateContentDto] })
  content: CreateContentDto[]

  @ApiProperty()
  passes: string[]

  @ApiProperty()
  private: boolean
}
