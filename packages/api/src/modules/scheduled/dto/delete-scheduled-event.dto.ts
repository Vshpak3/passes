import { PickType } from '@nestjs/swagger'

import { ScheduledEventDto } from './scheduled-event.dto'

export class DeleteScheduledEventRequestDto extends PickType(
  ScheduledEventDto,
  ['scheduledEventId'],
) {}
