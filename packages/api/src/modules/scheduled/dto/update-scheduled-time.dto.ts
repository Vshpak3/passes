import { PickType } from '@nestjs/swagger'

import { ScheduledEventDto } from './scheduled-event.dto'

export class UpdateScheduledTimeRequestDto extends PickType(ScheduledEventDto, [
  'scheduledEventId',
  'scheduledAt',
]) {}
