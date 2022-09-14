import { IsEnum, IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { SHA256_LENGTH, TRANSACTION_HASH_LENGTH } from '../constants/schema'
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

  @IsEnum(PayinStatusEnum)
  @DtoProperty({ enum: PayinStatusEnum })
  payinStatus: PayinStatusEnum

  @Min(0)
  @DtoProperty()
  amount: number

  @DtoProperty()
  createdAt: Date

  @IsEnum(PayinCallbackEnum)
  @DtoProperty({ enum: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @DtoProperty({ optional: true })
  card?: CircleCardDto

  @Length(1, TRANSACTION_HASH_LENGTH)
  @DtoProperty({ optional: true })
  transactionHash?: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ optional: true })
  address?: string

  @DtoProperty({ optional: true })
  callbackOutputJSON?: string

  @Length(1, SHA256_LENGTH)
  @DtoProperty({ optional: true })
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
