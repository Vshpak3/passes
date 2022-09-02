import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, Length } from 'class-validator'

import { COMMENT_CONTENT_LENGTH } from '../constants/schema'

export class CreateCommentRequestDto {
  @IsUUID()
  @ApiProperty()
  postId: string

  @ApiProperty()
  @Length(1, COMMENT_CONTENT_LENGTH)
  content: string
}
