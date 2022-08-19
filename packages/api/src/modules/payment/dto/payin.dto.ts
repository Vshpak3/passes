import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'
import { PayinMethodDto } from './payin-method.dto'

export class PayinDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  payinMethod: PayinMethodDto

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

  @ApiProperty()
  callbackOutputJSON?: string

  @ApiProperty()
  target?: string

  constructor(payin) {
    if (payin) {
      this.id = payin.id
      this.userId = payin.user_id
      this.payinMethod = {
        method: payin.payin_method,
        cardId: payin.card_id,
        chainId: payin.chain_id,
      }
      this.amount = payin.amount
      this.createdAt = payin.created_at
      this.callback = payin.callback
      this.payinStatus = payin.payin_status
      this.address = payin.address
      this.transactionHash = payin.transaction_hash
      this.callbackOutputJSON = payin.callback_output_json
      this.target = payin.target
    }
  }
}
