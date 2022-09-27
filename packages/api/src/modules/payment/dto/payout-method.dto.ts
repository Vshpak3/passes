import { DtoProperty } from '../../../web/dto.web'
import { PayoutMethodEnum } from '../enum/payout-method.enum'

export class PayoutMethodDto {
  @DtoProperty({ custom_type: PayoutMethodEnum })
  method: PayoutMethodEnum = PayoutMethodEnum.NONE

  @DtoProperty({ type: 'uuid', optional: true })
  bankId?: string

  @DtoProperty({ type: 'uuid', optional: true })
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
