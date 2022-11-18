import { PickType } from '@nestjs/swagger'

import { PostCategoryDto } from './post-category.dto'

export class EditPostCategoryRequestDto extends PickType(PostCategoryDto, [
  'postCategoryId',
  'name',
]) {}
