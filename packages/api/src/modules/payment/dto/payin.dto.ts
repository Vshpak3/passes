// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-magic-numbers */
import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  BLOCKCHAIN_ADDRESS_LENGTH,
  EXTERNAL_URL_LENGTH,
} from '../../wallet/constants/schema'
import { PayinCallbackOutput } from '../callback.types'
import { SHA256_LENGTH, TRANSACTION_HASH_LENGTH } from '../constants/schema'
import { PayinEntity } from '../entities/payin.entity'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
import { PayinMethodDto } from './payin-method.dto'

export class PayinDto {
  @DtoProperty({ type: 'uuid' })
  payinId: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @DtoProperty({ custom_type: PayinMethodDto })
  payinMethod: PayinMethodDto

  @DtoProperty({ custom_type: PayinStatusEnum })
  payinStatus: PayinStatusEnum

  @Min(0)
  @DtoProperty({ type: 'currency' })
  amount: number

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @DtoProperty({ custom_type: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @Length(1, 1)
  @DtoProperty({ type: 'string' })
  firstDigit: string

  @Length(4, 4)
  @DtoProperty({ type: 'string' })
  fourDigits: string

  @Length(1, TRANSACTION_HASH_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  transactionHash: string | null

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  address: string | null

  @DtoProperty({ custom_type: PayinCallbackOutput })
  callbackOutputJSON: PayinCallbackOutput | null

  @Length(1, SHA256_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  target: string | null

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  redirectUrl: string | null

  constructor(
    payin: (PayinEntity & { card_number?: string; chain?: string }) | undefined,
  ) {
    if (payin) {
      this.payinId = payin.id
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
      this.redirectUrl = payin.redirect_url
      if (payin.card_number) {
        this.firstDigit = payin.card_number.slice(0, 1)
        this.fourDigits = payin.card_number.slice(payin.card_number.length - 4)
      }
    }
  }
}
