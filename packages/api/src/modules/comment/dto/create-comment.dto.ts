import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { COMMENT_CONTENT_LENGTH } from '../constants/schema'

export class CreateCommentRequestDto {
  @ApiProperty()
  postId: string

  @ApiProperty()
  @Length(1, COMMENT_CONTENT_LENGTH)
  content: string
}
