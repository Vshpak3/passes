import { PartialType } from '@nestjs/swagger'

import { CreateSettingsRequestDto } from './create-settings.dto'

export class UpdateSettingsRequestDto extends PartialType(
  CreateSettingsRequestDto,
) {}
