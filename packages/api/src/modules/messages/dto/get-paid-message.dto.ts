import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PaidMessageDto } from './paid-message.dto'

export class GetPaidMessagesRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {}

export class GetPaidMessagesResponseDto extends PageResponseDto {
  @DtoProperty({ custom_type: [PaidMessageDto] })
  paidMessages: PaidMessageDto[]

  @DtoProperty({ type: 'date' })
  sentAt: Date

  constructor(paidMessages: PaidMessageDto[]) {
    super()
    this.paidMessages = paidMessages

    if (paidMessages.length > 0) {
      this.lastId = paidMessages[paidMessages.length - 1].paidMessageId
      this.createdAt = paidMessages[paidMessages.length - 1].createdAt
    }
  }
}
