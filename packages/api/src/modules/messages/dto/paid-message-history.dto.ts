import { PickType } from '@nestjs/swagger'

import { PaidMessageHistoryEntity } from '../entities/paid-message-history.entity'
import { PaidMessageDto } from './paid-message.dto'

export class PaidMessageHistoryDto extends PickType(PaidMessageDto, [
  'paidMessageId',
  'numPurchases',
  'earningsPurchases',
]) {
  constructor(paidMessageHistory: PaidMessageHistoryEntity | undefined) {
    super()
    if (paidMessageHistory) {
      this.paidMessageId = paidMessageHistory.paid_message_id
      this.numPurchases = paidMessageHistory.num_purchases
      this.earningsPurchases = paidMessageHistory.earnings_purchases
    }
  }
}
