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

  @Min(0)
  @DtoProperty({ optional: true })
  price?: number

  @DtoProperty({ optional: true })
  expiresAt?: Date

  @DtoProperty({ optional: true })
  scheduledAt?: Date
}

export class CreatePostResponseDto {
  @IsUUID()
  @DtoProperty()
  postId: string
}
