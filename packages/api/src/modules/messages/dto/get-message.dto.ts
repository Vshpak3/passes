import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { MessageDto } from './message.dto'

export class GetMessageResponseDto extends MessageDto {}

export class GetMessagesRequestDto extends PickType(PageRequestDto, [
  'lastId',
]) {
  @DtoProperty({ type: 'date', optional: true })
  sentAt?: Date

  @DtoProperty({ type: 'date', optional: true })
  dateLimit?: Date

  @DtoProperty({ type: 'uuid' })
  channelId: string

  @DtoProperty({ type: 'boolean' })
  contentOnly: boolean

  @DtoProperty({ type: 'boolean' })
  pending: boolean
}

export class GetMessagesResponseDto extends PageResponseDto {
  @DtoProperty({ custom_type: [MessageDto] })
  messages: MessageDto[]

  @DtoProperty({ type: 'date' })
  sentAt: Date

  constructor(messages: MessageDto[]) {
    super()
    this.messages = messages

    if (messages.length > 0) {
      this.lastId = messages[messages.length - 1].messageId
      this.sentAt = messages[messages.length - 1].sentAt
    }
  }
}
