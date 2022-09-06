import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { POST_TEXT_LENGTH } from '../constants/schema'

export class CreatePostRequestDto {
  @DtoProperty()
  @Length(1, POST_TEXT_LENGTH)
  text: string

  @DtoProperty()
  contentIds: string[]

  @DtoProperty()
  passIds: string[]

  @DtoProperty()
  isMessage: boolean

  @DtoProperty({ required: false })
  price?: number

  @DtoProperty({ required: false })
  expiresAt?: Date

  @DtoProperty({ required: false })
  scheduledAt?: Date
}

export class CreatePostResponseDto {
  @DtoProperty()
  postId: string
}
