import { PartialType } from '@nestjs/swagger'

import { CreatorSettingsDto } from './creator-settings.dto'

export class UpdateCreatorSettingsRequestDto extends PartialType(
  CreatorSettingsDto,
) {}
