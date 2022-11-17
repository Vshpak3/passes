import { DtoProperty } from '../../../web/dto.web'

export class PostToCategoryRequestDto {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @DtoProperty({ type: 'uuid' })
  postCategoryId: string
}
