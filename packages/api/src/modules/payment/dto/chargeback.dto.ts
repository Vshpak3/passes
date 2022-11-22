import { PickType } from '@nestjs/swagger'
import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { UserDto } from '../../user/dto/user.dto'
import { UserEntity } from '../../user/entities/user.entity'
import {
  BLOCKCHAIN_ADDRESS_LENGTH,
  EXTERNAL_URL_LENGTH,
} from '../../wallet/constants/schema'
import { PayinCallbackInput, PayinCallbackOutput } from '../callback.types'
import { SHA256_LENGTH, TRANSACTION_HASH_LENGTH } from '../constants/schema'
import { CircleChargebackEntity } from '../entities/circle-chargeback.entity'
import { PayinEntity } from '../entities/payin.entity'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
import { PayinMethodDto } from './payin-method.dto'

export class ChargebackDto extends PickType(UserDto, [
  'username',
  'displayName',
  'email',
  'legalFullName',
]) {
  @DtoProperty({ type: 'uuid' })
  payinId: string

  @DtoProperty({ type: 'uuid' })
  circlePaymentId: string

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

  @Length(1, TRANSACTION_HASH_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  transactionHash: string | null

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  address: string | null

  @DtoProperty({ type: 'any' })
  callbackOutputJSON: PayinCallbackOutput | null

  @DtoProperty({ type: 'any' })
  callbackInputJSON: PayinCallbackInput | null

  @DtoProperty({ type: 'any' })
  fullContent: any

  @Length(1, SHA256_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  target: string | null

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  redirectUrl: string | null

  constructor(
    payin: (PayinEntity & CircleChargebackEntity & UserEntity) | undefined,
  ) {
    super()
    if (payin) {
      this.payinId = payin.id
      this.userId = payin.user_id
      this.username = payin.username
      this.displayName = payin.display_name
      this.legalFullName = payin.legal_full_name
      this.email = payin.email
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
      this.callbackInputJSON = payin.callback_input_json
      this.target = payin.target
      this.redirectUrl = payin.redirect_url
      this.fullContent = payin.full_content

      this.circlePaymentId = payin.circle_payment_id
    }
  }
}
