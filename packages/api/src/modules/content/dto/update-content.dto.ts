import { PartialType } from '@nestjs/swagger'

import { CreateContentRequestDto } from './create-content.dto'

export class UpdateContentRequestDto extends PartialType(
  CreateContentRequestDto,
) {}
