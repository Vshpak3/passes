import { PartialType } from '@nestjs/swagger'

import { ChannelSettingsDto } from './channel-settings.dto'

export class UpdateChannelSettingsRequestDto extends PartialType(
  ChannelSettingsDto,
) {}
