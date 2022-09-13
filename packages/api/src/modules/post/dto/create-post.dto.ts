import { IsUUID, Length, Min } from 'class-validator'

import { TagDto } from '../../../util/dto/tag.dto'
import { DtoProperty } from '../../../web/dto.web'
import { POST_TEXT_LENGTH } from '../constants/schema'

export class CreatePostRequestDto {
  @DtoProperty()
  @Length(1, POST_TEXT_LENGTH)
  text: string

  @DtoProperty()
  tags: TagDto[]

  @IsUUID('all', { each: true })
  @DtoProperty()
  contentIds: string[]

  @IsUUID('all', { each: true })
  @DtoProperty()
  passIds: string[]

  @DtoProperty()
  isMessage: boolean

  @Min(0)
  @DtoProperty({ required: false })
  price?: number

  @DtoProperty({ required: false })
  expiresAt?: Date

  @DtoProperty({ required: false })
  scheduledAt?: Date
}

export class CreatePostResponseDto {
  @IsUUID()
  @DtoProperty()
  postId: string
}
