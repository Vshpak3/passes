import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { TRANSACTION_HASH_LENGTH } from '../constants/schema'
import { PayoutEntity } from '../entities/payout.entity'
import { PayoutStatusEnum } from '../enum/payout.status.enum'
import { PayoutMethodDto } from './payout-method.dto'

export class PayoutDto {
  @DtoProperty({ type: 'uuid' })
  payoutId: string

  @DtoProperty({ custom_type: PayoutMethodDto })
  payoutMethod: PayoutMethodDto

  @DtoProperty({ custom_type: PayoutStatusEnum })
  payoutStatus: PayoutStatusEnum

  @Min(0)
  @DtoProperty({ type: 'currency' })
  amount: number

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @Length(1, TRANSACTION_HASH_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  transactionHash?: string | null

  @DtoProperty({ type: 'string', optional: true })
  bank_description?: string

  @DtoProperty({ type: 'string', optional: true })
  address?: string

  @DtoProperty({ custom_type: ChainEnum, optional: true })
  chain?: ChainEnum

  constructor(
    payout:
      | (PayoutEntity & {
          bank_description?: string
          address?: string
          chain?: ChainEnum
        })
      | undefined,
  ) {
    if (payout) {
      this.payoutId = payout.id

      this.payoutMethod = {
        method: payout.payout_method,
        bankId: payout.bank_id,
        walletId: payout.wallet_id,
      }
      this.amount = payout.amount
      this.createdAt = payout.created_at
      this.payoutStatus = payout.payout_status
      this.transactionHash = payout.transaction_hash
      if (payout.bank_description) {
        this.bank_description = payout.bank_description
      }
      if (payout.address) {
        this.bank_description = payout.address
      }
      if (payout.chain) {
        this.chain = payout.chain
      }
    }
  }
}
