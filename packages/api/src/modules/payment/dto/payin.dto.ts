import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodEnum } from '../enum/payin.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'

export class PayinDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty({ enum: PayinMethodEnum })
  payinMethod: PayinMethodEnum

  @ApiPropertyOptional()
  cardId?: string

  @ApiPropertyOptional()
  chainId?: number

  @ApiProperty({ enum: PayinStatusEnum })
  payinStatus: PayinStatusEnum

  @ApiProperty()
  amount: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ enum: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @ApiPropertyOptional()
  card?: CircleCardDto

  @ApiPropertyOptional()
  transactionHash?: string

  @ApiPropertyOptional()
  address?: string

  constructor(payin) {
    if (payin) {
      this.id = payin.id
      this.userId = payin.user_id
      this.cardId = payin.card_id
      this.chainId = payin.chain_id
      this.payinMethod = payin.payin_method
      this.amount = payin.amount
      this.createdAt = payin.created_at
      this.callback = payin.callback
      this.payinStatus = payin.payin_status
      this.address = payin.address
      this.transactionHash = payin.transaction_hash
    }
  }
}
