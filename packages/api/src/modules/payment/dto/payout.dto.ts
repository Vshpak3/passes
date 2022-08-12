import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { WalletDto } from '../../wallet/dto/wallet.dto'
import { PayoutMethodEnum } from '../enum/payout.enum'
import { PayoutStatusEnum } from '../enum/payout.status.enum'
import { CircleBankDto } from './circle/circle-bank.dto'

export class PayoutDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty({ enum: PayoutMethodEnum })
  payoutMethod: PayoutMethodEnum

  @ApiPropertyOptional()
  bankId?: string

  @ApiPropertyOptional()
  walletId?: string

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
      this.bankId = payout.bank_id
      this.walletId = payout.wallet_id
      this.payoutMethod = payout.payout_method
      this.amount = payout.amount
      this.createdAt = payout.created_at
      this.payoutStatus = payout.payout_status
      this.transactionHash = payout.transaction_hash
    }
  }
}
