import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { COMMENT_TEXT_LENGTH } from '../constants/schema'

export class CreateCommentRequestDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @DtoProperty()
  @Length(1, COMMENT_TEXT_LENGTH)
  text: string
}
