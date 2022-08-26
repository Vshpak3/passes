import { PickType } from '@nestjs/swagger'

import { CreatePassRequestDto } from './create-pass.dto'

export class UpdatePassRequestDto extends PickType(CreatePassRequestDto, [
  'title',
  'description',
] as const) {}
