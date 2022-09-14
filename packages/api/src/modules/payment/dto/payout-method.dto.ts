import { IsEnum, IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayoutMethodEnum } from '../enum/payout-method.enum'

export class PayoutMethodDto {
  @IsEnum(PayoutMethodEnum)
  @DtoProperty({ enum: PayoutMethodEnum })
  method: PayoutMethodEnum = PayoutMethodEnum.NONE

  @IsUUID()
  @DtoProperty({ optional: true })
  bankId?: string

  @IsUUID()
  @DtoProperty({ optional: true })
  walletId?: string

  constructor(payoutMethod) {
    if (payoutMethod) {
      this.method = payoutMethod.method
      this.bankId = payoutMethod.bank_id
      this.walletId = payoutMethod.wallet_id
    }
  }
}

export class SetPayoutMethodRequestDto extends PayoutMethodDto {}
export class GetPayoutMethodResponseDto extends PayoutMethodDto {}
