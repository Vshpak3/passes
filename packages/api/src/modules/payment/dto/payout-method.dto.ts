import { DtoProperty } from '../../../web/endpoint.web'
import { PayoutMethodEnum } from '../enum/payout-method.enum'

export class PayoutMethodDto {
  @DtoProperty({ enum: PayoutMethodEnum })
  method: PayoutMethodEnum = PayoutMethodEnum.NONE

  @DtoProperty({ required: false })
  bankId?: string

  @DtoProperty({ required: false })
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
