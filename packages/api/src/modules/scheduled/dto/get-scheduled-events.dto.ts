import { DtoProperty } from '../../../web/dto.web'
import { ScheduledEventDto } from './scheduled-event.dto'

export class GetScheduledEventsRequestDto {
  @DtoProperty({ type: 'date' })
  startDate: Date

  @DtoProperty({ type: 'date' })
  endDate: Date
}

export class GetScheduledEventsResponseDto {
  @DtoProperty({ custom_type: [ScheduledEventDto] })
  data: ScheduledEventDto[]

  constructor(scheduledEvents: ScheduledEventDto[]) {
    this.data = scheduledEvents
  }
}
