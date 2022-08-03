import { PickType } from '@nestjs/swagger'

import { CreateCollectionDto } from './create-collection.dto'

export class UpdateCollectionDto extends PickType(CreateCollectionDto, [
  'title',
  'description',
] as const) {}
