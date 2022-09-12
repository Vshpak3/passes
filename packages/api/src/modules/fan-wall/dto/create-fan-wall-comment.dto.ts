import { Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import { FAN_COMMENT_TEXT_LENGTH } from '../constants/schema'

export class CreateFanWallCommentRequestDto {
  @DtoProperty()
  creatorId: string

  @DtoProperty()
  @Length(1, FAN_COMMENT_TEXT_LENGTH)
  text: string

  @DtoProperty()
  tags: TagDto[]
}
