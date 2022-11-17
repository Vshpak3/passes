import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { POST_CATEGORY_NAME_LENGTH } from '../constants/schema'

export class CreatePostCategoryRequestDto {
  @Length(1, POST_CATEGORY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string
}

export class CreatePostCategoryResponseDto {
  @DtoProperty({ type: 'uuid' })
  postCategoryId: string

  constructor(postCategoryId: string) {
    this.postCategoryId = postCategoryId
  }
}
