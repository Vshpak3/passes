import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, Length } from 'class-validator'

import { POST_TEXT_LENGTH } from '../constants/schema'

export class CreatePostRequestDto {
  @ApiProperty()
  @Length(1, POST_TEXT_LENGTH)
  text: string

  @ApiProperty()
  content: string[]

  @ApiProperty()
  passes: string[]

  @ApiProperty()
  private: boolean

  @ApiPropertyOptional()
  price?: number

  @IsInt()
  @ApiPropertyOptional()
  expiresAt?: number

  @ApiPropertyOptional()
  scheduledAt?: Date
}
