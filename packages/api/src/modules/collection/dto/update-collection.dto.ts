import { PickType } from '@nestjs/swagger'

import { CollectionDto } from './collection.dto'

export class UpdateCollectionRequestDto extends PickType(CollectionDto, [
  'title',
  'description',
] as const) {}
