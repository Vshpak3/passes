import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { FAN_COMMENT_TEXT_LENGTH } from '../constants/schema'

export class CreateFanWallCommentRequestDto {
  @ApiProperty()
  creatorId: string

  @ApiProperty()
  @Length(1, FAN_COMMENT_TEXT_LENGTH)
  text: string
}
