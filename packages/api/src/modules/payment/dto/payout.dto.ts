import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { WalletDto } from '../../wallet/dto/wallet.dto'
import { PayoutStatusEnum } from '../enum/payout.status.enum'
import { CircleBankDto } from './circle/circle-bank.dto'
import { PayoutMethodDto } from './payout-method.dto'

export class PayoutDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  payoutMethod: PayoutMethodDto

  @DtoProperty({ enum: PayoutStatusEnum })
  payoutStatus: PayoutStatusEnum

  @DtoProperty()
  amount: number

  @DtoProperty()
  createdAt: Date

  @DtoProperty({ required: false })
  transactionHash?: string

  @DtoProperty({ required: false })
  bank?: CircleBankDto

  @DtoProperty({ required: false })
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
