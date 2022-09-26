import { PickType } from '@nestjs/swagger'

import { PaidMessageDto } from './paid-message.dto'

export class PaidMessageHistoryDto extends PickType(PaidMessageDto, [
  'paidMessageId',
  'creatorId',
  'price',
]) {
  constructor(paidMessageHistory) {
    super()
    if (paidMessageHistory) {
      this.paidMessageId = paidMessageHistory.paid_message_id
      this.creatorId = paidMessageHistory.creator_id
      this.price = paidMessageHistory.price
    }
  }
}
