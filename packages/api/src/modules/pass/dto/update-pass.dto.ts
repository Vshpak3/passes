import { PickType } from '@nestjs/swagger'

import { CreatePassDto } from './create-pass.dto'

export class UpdatePassDto extends PickType(CreatePassDto, [
  'title',
  'description',
] as const) {}
