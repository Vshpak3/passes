import { PartialType } from '@nestjs/swagger'

import { NotificationSettingsDto } from './notification-settings.dto'

export class UpdateNotificationSettingsRequestDto extends PartialType(
  NotificationSettingsDto,
) {}
