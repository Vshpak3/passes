import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { POST_CATEGORY_NAME_LENGTH } from '../constants/schema'
import { PostCategoryEntity } from '../entities/post-category.entity'

export class PostCategoryDto {
  @DtoProperty({ type: 'uuid' })
  postCategoryId: string

  @Length(1, POST_CATEGORY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string

  @DtoProperty({ type: 'number' })
  order: number

  constructor(postCategory: PostCategoryEntity) {
    if (postCategory) {
      this.postCategoryId = postCategory.id
      this.name = postCategory.name
      this.order = postCategory.order
    }
  }
}
