import { IsUUID, Length } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import { COMMENT_TEXT_LENGTH } from '../constants/schema'

export class CreateCommentRequestDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @Length(1, COMMENT_TEXT_LENGTH)
  @DtoProperty()
  text: string

  @DtoProperty()
  tags: TagDto[]
}
