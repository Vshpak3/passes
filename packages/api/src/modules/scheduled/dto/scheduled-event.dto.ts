import { DtoProperty } from '../../../web/dto.web'
import { ContentBareDto } from '../../content/dto/content-bare'
import { ListDto } from '../../list/dto/list.dto'
import { CreateBatchMessageRequestDto } from '../../messages/dto/create-batch-message.dto'
import { SendMessageRequestDto } from '../../messages/dto/send-message.dto'
import { PassDto } from '../../pass/dto/pass.dto'
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

  @DtoProperty({ type: 'boolean' })
  processed: boolean

  @DtoProperty({ custom_type: [ContentBareDto], optional: true })
  contents?: ContentBareDto[]

  @DtoProperty({ custom_type: [ListDto], optional: true })
  lists?: ListDto[]

  @DtoProperty({ custom_type: [PassDto], optional: true })
  passes?: PassDto[]

  constructor(
    scheduledEvent: ScheduledEventEntity | undefined,
    contents?: ContentBareDto[],
    lists?: ListDto[],
    passes?: PassDto[],
  ) {
    if (scheduledEvent) {
      this.scheduledEventId = scheduledEvent.id
      this.type = scheduledEvent.type
      this.processed = scheduledEvent.processed
      switch (this.type) {
        case ScheduledEventTypeEnum.CREATE_POST:
          this.createPost = scheduledEvent.body
          break
        case ScheduledEventTypeEnum.SEND_MESSAGE:
          this.sendMessage = scheduledEvent.body
          break
        case ScheduledEventTypeEnum.BATCH_MESSAGE:
          this.batchMessage = scheduledEvent.body
          break
      }
      this.scheduledAt = scheduledEvent.scheduled_at
      this.contents = contents
      this.lists = lists
      this.passes = passes
    }
  }
}
