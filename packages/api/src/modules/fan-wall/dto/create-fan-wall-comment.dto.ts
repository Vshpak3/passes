import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { FAN_COMMENT_TEXT_LENGTH } from '../constants/schema'

export class CreateFanWallCommentRequestDto {
  @DtoProperty()
  creatorId: string

  @DtoProperty()
  @Length(1, FAN_COMMENT_TEXT_LENGTH)
  text: string
}
