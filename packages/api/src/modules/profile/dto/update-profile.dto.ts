import { PartialType } from '@nestjs/swagger'

import { CreateProfileRequestDto } from './create-profile.dto'

export class UpdateProfileRequestDto extends PartialType(
  CreateProfileRequestDto,
) {}
