import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { POST_TEXT_LENGTH } from '../constants/schema'

export class CreatePostRequestDto {
  @ApiProperty()
  @Length(1, POST_TEXT_LENGTH)
  text: string

  @ApiProperty()
  contentIds: string[]

  @ApiProperty()
  passIds: string[]

  @ApiProperty()
  isMessage: boolean

  @ApiPropertyOptional()
  price?: number

  @ApiPropertyOptional()
  expiresAt?: Date

  @ApiPropertyOptional()
  scheduledAt?: Date
}

export class CreatePostResponseDto {
  @ApiProperty()
  postId: string
}
