import { DtoProperty } from '../../../web/dto.web'
import { DefaultPayoutMethodEntity } from '../entities/default-payout-method.entity'
import { PayoutMethodEnum } from '../enum/payout-method.enum'

export class PayoutMethodDto {
  @DtoProperty({ custom_type: PayoutMethodEnum })
  method: PayoutMethodEnum = PayoutMethodEnum.NONE

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  bankId?: string | null

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  walletId?: string | null

  constructor(payoutMethod: DefaultPayoutMethodEntity | undefined) {
    if (payoutMethod) {
      this.method = payoutMethod.method
      this.bankId = payoutMethod.bank_id
      this.walletId = payoutMethod.wallet_id
    }
  }
}

export class SetPayoutMethodRequestDto extends PayoutMethodDto {}
export class GetPayoutMethodResponseDto extends PayoutMethodDto {}
