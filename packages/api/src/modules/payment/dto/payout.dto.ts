import { IsEnum, IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { WalletDto } from '../../wallet/dto/wallet.dto'
import { TRANSACTION_HASH_LENGTH } from '../constants/schema'
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

  @IsEnum(PayoutStatusEnum)
  @DtoProperty({ enum: PayoutStatusEnum })
  payoutStatus: PayoutStatusEnum

  @Min(0)
  @DtoProperty()
  amount: number

  @DtoProperty()
  createdAt: Date

  @Length(1, TRANSACTION_HASH_LENGTH)
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
