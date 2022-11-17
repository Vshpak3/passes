import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { POST_CATEGORY_NAME_LENGTH } from '../constants/schema'

export class EditPostCategoryRequestDto {
  @DtoProperty({ type: 'uuid' })
  postCategoryId: string

  @Length(1, POST_CATEGORY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string
}
