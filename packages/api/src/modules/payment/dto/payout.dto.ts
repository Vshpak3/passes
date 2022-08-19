import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { WalletDto } from '../../wallet/dto/wallet.dto'
import { PayoutStatusEnum } from '../enum/payout.status.enum'
import { CircleBankDto } from './circle/circle-bank.dto'
import { PayoutMethodDto } from './payout-method.dto'

export class PayoutDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  payoutMethod: PayoutMethodDto

  @ApiProperty({ enum: PayoutStatusEnum })
  payoutStatus: PayoutStatusEnum

  @ApiProperty()
  amount: number

  @ApiProperty()
  createdAt: Date

  @ApiPropertyOptional()
  transactionHash?: string

  @ApiPropertyOptional()
  bank?: CircleBankDto

  @ApiPropertyOptional()
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
