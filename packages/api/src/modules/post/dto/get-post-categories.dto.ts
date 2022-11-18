import { DtoProperty } from '../../../web/dto.web'
import { PostCategoryDto } from './post-category.dto'

export class GetPostCategoriesRequestDto {
  @DtoProperty({ type: 'uuid' })
  userId: string
}

export class GetPostCategoriesResponseDto {
  @DtoProperty({ custom_type: [PostCategoryDto] })
  postCategories: PostCategoryDto[]

  constructor(postCategories: PostCategoryDto[]) {
    this.postCategories = postCategories
  }
}
