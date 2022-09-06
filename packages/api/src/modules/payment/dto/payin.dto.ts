import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'
import { PayinMethodDto } from './payin-method.dto'

export class PayinDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  payinMethod: PayinMethodDto

  @DtoProperty({ enum: PayinStatusEnum })
  payinStatus: PayinStatusEnum

  @DtoProperty()
  amount: number

  @DtoProperty()
  createdAt: Date

  @DtoProperty({ enum: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @DtoProperty({ required: false })
  card?: CircleCardDto

  @DtoProperty({ required: false })
  transactionHash?: string

  @DtoProperty({ required: false })
  address?: string

  @DtoProperty({ required: false })
  callbackOutputJSON?: string

  @DtoProperty({ required: false })
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
