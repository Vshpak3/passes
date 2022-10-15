import { PickType } from '@nestjs/swagger'

import { ScheduledEventDto } from './scheduled-event.dto'

export class UpdateScheduledEventRequestDto extends PickType(
  ScheduledEventDto,
  ['scheduledEventId', 'createPost', 'sendMessage', 'batchMessage', 'type'],
) {}
