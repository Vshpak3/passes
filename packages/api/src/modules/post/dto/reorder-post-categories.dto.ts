import { DtoProperty } from '../../../web/dto.web'

export class ReorderPostCategoriesRequestDto {
  @DtoProperty({ type: 'uuid[]' })
  postCategoryIds: string[]
}
