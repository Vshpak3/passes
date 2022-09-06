import { DtoProperty } from '../../../web/endpoint.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PayinMethodEnum } from '../enum/payin-method.enum'

export class PayinMethodDto {
  @DtoProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum = PayinMethodEnum.NONE

  @DtoProperty({ required: false })
  cardId?: string

  @DtoProperty({ required: false })
  chainId?: number

  @DtoProperty({ enum: ChainEnum, required: false })
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
