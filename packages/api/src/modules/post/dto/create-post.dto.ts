import { Length, Min } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import { POST_TEXT_LENGTH } from '../constants/schema'

export class CreatePostRequestDto {
  @Length(1, POST_TEXT_LENGTH)
  @DtoProperty({ type: 'string' })
  text: string

  @DtoProperty({ custom_type: [TagDto] })
  tags: TagDto[]

  @DtoProperty({ type: 'uuid[]' })
  contentIds: string[]

  @DtoProperty({ type: 'uuid[]' })
  passIds: string[]

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  price?: number

  @DtoProperty({ type: 'date', optional: true })
  expiresAt?: Date

  @DtoProperty({ type: 'date', optional: true })
  scheduledAt?: Date
}

export class CreatePostResponseDto {
  @DtoProperty({ type: 'uuid' })
  postId: string
}
