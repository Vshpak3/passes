import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { PostCategoryDto } from './post-category.dto'

export class CreatePostCategoryRequestDto extends PickType(PostCategoryDto, [
  'name',
  'order',
]) {}

export class CreatePostCategoryResponseDto {
  @DtoProperty({ type: 'uuid' })
  postCategoryId: string

  constructor(postCategoryId: string) {
    this.postCategoryId = postCategoryId
  }
}
