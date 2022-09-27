import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { WalletDto } from '../../wallet/dto/wallet.dto'
import { TRANSACTION_HASH_LENGTH } from '../constants/schema'
import { PayoutStatusEnum } from '../enum/payout.status.enum'
import { CircleBankDto } from './circle/circle-bank.dto'
import { PayoutMethodDto } from './payout-method.dto'

export class PayoutDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @DtoProperty({ custom_type: PayoutMethodDto })
  payoutMethod: PayoutMethodDto

  @DtoProperty({ custom_type: PayoutStatusEnum })
  payoutStatus: PayoutStatusEnum

  @Min(0)
  @DtoProperty({ type: 'number' })
  amount: number

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @Length(1, TRANSACTION_HASH_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  transactionHash?: string

  @DtoProperty({ custom_type: CircleBankDto, optional: true })
  bank?: CircleBankDto

  @DtoProperty({ custom_type: WalletDto, optional: true })
  wallet?: WalletDto

  constructor(payout) {
    if (payout) {
      this.id = payout.id
      this.userId = payout.user_id

      this.payoutMethod = {
        method: payout.payout_method,
        bankId: payout.bank_id,
        walletId: payout.wallet_id,
      }
      this.amount = payout.amount
      this.createdAt = payout.created_at
      this.payoutStatus = payout.payout_status
      this.transactionHash = payout.transaction_hash
    }
  }
}
