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

  @DtoProperty({ type: 'boolean', optional: true })
  paid?: boolean

  @DtoProperty({ type: 'boolean' })
  pending: boolean
}

export class GetMessagesResponseDto
  extends GetMessagesRequestDto
  implements PageResponseDto<MessageDto>
{
  @DtoProperty({ custom_type: [MessageDto] })
  data: MessageDto[]

  constructor(messages: MessageDto[], requestDto: GetMessagesRequestDto) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = messages

    if (messages.length > 0) {
      this.lastId = messages[messages.length - 1].messageId
      this.sentAt = messages[messages.length - 1].sentAt
    }
  }
}
