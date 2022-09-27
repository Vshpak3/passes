import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PayinMethodEnum } from '../enum/payin-method.enum'

export class PayinMethodDto {
  @DtoProperty({ custom_type: PayinMethodEnum })
  method: PayinMethodEnum = PayinMethodEnum.NONE

  @DtoProperty({ type: 'uuid', optional: true })
  cardId?: string

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  chainId?: number

  @DtoProperty({ custom_type: ChainEnum, optional: true })
  chain?: ChainEnum

  constructor(payinMethod) {
    if (payinMethod) {
      this.method = payinMethod.method
      this.cardId = payinMethod.card_id
      this.chainId = payinMethod.chain_id
    }
  }
}

export class SetPayinMethodRequestDto extends PayinMethodDto {}
export class GetPayinMethodResponseDto extends PayinMethodDto {}
