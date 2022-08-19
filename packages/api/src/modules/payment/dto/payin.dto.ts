import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'
import { PayinMethodDto } from './payin-method.dto'
import { PayinTargetDto } from './payin-target.dto'

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

  @ApiPropertyOptional()
  payinTarget: PayinTargetDto

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
      this.payinTarget = {
        target: payin.target,
        passId: payin.pass_id,
        passOwnershipId: payin.pass_ownership_id,
      }
    }
  }
}
