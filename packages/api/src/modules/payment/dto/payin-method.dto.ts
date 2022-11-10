import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { DefaultPayinMethodEntity } from '../entities/default-payin-method.entity'
import { PayinMethodEnum } from '../enum/payin-method.enum'

export class PayinMethodDto {
  @DtoProperty({ custom_type: PayinMethodEnum })
  method: PayinMethodEnum = PayinMethodEnum.NONE

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  cardId?: string | null

  @Min(0)
  @DtoProperty({ type: 'number', nullable: true, optional: true })
  chainId?: number | null

  @DtoProperty({ custom_type: ChainEnum, optional: true, nullable: true })
  chain?: ChainEnum | null

  constructor(payinMethod: DefaultPayinMethodEntity | undefined) {
    if (payinMethod) {
      this.method = payinMethod.method
      this.cardId = payinMethod.card_id
      this.chainId = payinMethod.chain_id
    }
  }
}

export class SetPayinMethodRequestDto extends PayinMethodDto {}
export class GetPayinMethodResponseDto extends PayinMethodDto {}
