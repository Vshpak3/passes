import { PickType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { MessageDto } from './message.dto'

export class GetMessageResponseDto extends MessageDto {}

export class GetMessagesRequestDto extends PickType(PageRequestDto, [
  'createdAt',
  'lastId',
]) {
  @DtoProperty()
  dateLimit?: Date

  @IsUUID()
  @DtoProperty()
  channelId: string

  @DtoProperty()
  contentOnly: boolean

  @DtoProperty()
  pending: boolean
}

export class GetMessagesResponseDto extends PageResponseDto {
  @DtoProperty({ type: [MessageDto] })
  messages: MessageDto[]

  constructor(messages: MessageDto[]) {
    super()
    this.messages = messages

    if (messages.length > 0) {
      this.lastId = messages[messages.length - 1].messageId
      this.createdAt = messages[messages.length - 1].createdAt
    }
  }
}
