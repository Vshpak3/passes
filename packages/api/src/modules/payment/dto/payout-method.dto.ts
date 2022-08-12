import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayoutMethodEnum } from '../enum/payout.enum'

export class PayoutMethodDto {
  @ApiProperty({ enum: PayoutMethodEnum })
  method: PayoutMethodEnum

  @ApiPropertyOptional()
  bankId?: string

  @ApiPropertyOptional()
  walletId?: string

  constructor(payoutMethod) {
    if (payoutMethod) {
      this.method = payoutMethod.method
      this.bankId = payoutMethod.bank_id
      this.walletId = payoutMethod.wallet_id
    }
  }
}
