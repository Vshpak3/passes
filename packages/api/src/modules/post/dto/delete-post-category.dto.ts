import { PickType } from '@nestjs/swagger'

import { PostCategoryDto } from './post-category.dto'

export class DeletePostCategoryRequestDto extends PickType(PostCategoryDto, [
  'postCategoryId',
  'order',
]) {}
