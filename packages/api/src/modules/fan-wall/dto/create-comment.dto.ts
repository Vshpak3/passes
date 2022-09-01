import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { FAN_COMMENT_CONTENT_LENGTH } from '../constants/schema'

export class CreateFanWallCommentRequestDto {
  @ApiProperty()
  creatorUsername: string

  @ApiProperty()
  @Length(1, FAN_COMMENT_CONTENT_LENGTH)
  content: string
}
