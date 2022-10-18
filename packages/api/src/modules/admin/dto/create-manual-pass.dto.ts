import { IntersectionType } from '@nestjs/swagger'

import { CreatePassRequestDto } from '../../pass/dto/create-pass.dto'
import { AdminDto } from './admin.dto'

export class CreateManualPassRequestDto extends IntersectionType(
  CreatePassRequestDto,
  AdminDto,
) {}
