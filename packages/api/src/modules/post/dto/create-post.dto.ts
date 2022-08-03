import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { CreateContentDto } from '../../content/dto/create-content.dto'

export class CreatePostDto {
  @ApiProperty()
  @Length(1, 400)
  text: string

  @ApiProperty()
  content: CreateContentDto[]

  @ApiProperty()
  passes: string[]
}
