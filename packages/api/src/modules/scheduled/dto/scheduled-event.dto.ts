import { DtoProperty } from '../../../web/dto.web'
import { CreateBatchMessageRequestDto } from '../../messages/dto/create-batch-message.dto'
import { SendMessageRequestDto } from '../../messages/dto/send-message.dto'
import { CreatePostRequestDto } from '../../post/dto/create-post.dto'
import { ScheduledEventEntity } from '../entities/scheduled-event.entity'
import { ScheduledEventTypeEnum } from '../enum/scheduled-event.type.enum'

export class ScheduledEventDto {
  @DtoProperty({ type: 'uuid' })
  scheduledEventId: string

  @DtoProperty({ custom_type: CreatePostRequestDto, optional: true })
  createPost?: CreatePostRequestDto

  @DtoProperty({ custom_type: SendMessageRequestDto, optional: true })
  sendMessage?: SendMessageRequestDto

  @DtoProperty({ custom_type: CreateBatchMessageRequestDto, optional: true })
  batchMessage?: CreateBatchMessageRequestDto

  @DtoProperty({ custom_type: ScheduledEventTypeEnum })
  type: ScheduledEventTypeEnum

  @DtoProperty({ type: 'date' })
  scheduledAt: Date

  constructor(scheduledEvent: ScheduledEventEntity | undefined) {
    if (scheduledEvent) {
      this.scheduledEventId = scheduledEvent.id
      this.type = scheduledEvent.type
      switch (this.type) {
        case ScheduledEventTypeEnum.CREATE_POST:
          this.createPost = JSON.parse(scheduledEvent.body)
          break
        case ScheduledEventTypeEnum.SEND_MESSAGE:
          this.sendMessage = JSON.parse(scheduledEvent.body)
          break
        case ScheduledEventTypeEnum.BATCH_MESSAGE:
          this.batchMessage = JSON.parse(scheduledEvent.body)
          break
      }
      this.scheduledAt = scheduledEvent.scheduled_at
    }
  }
}
