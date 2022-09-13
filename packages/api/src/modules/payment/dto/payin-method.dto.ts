import { IsEnum, IsInt, IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PayinMethodEnum } from '../enum/payin-method.enum'

export class PayinMethodDto {
  @IsEnum(PayinMethodEnum)
  @DtoProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum = PayinMethodEnum.NONE

  @IsUUID()
  @DtoProperty({ required: false })
  cardId?: string

  @IsInt()
  @Min(0)
  @DtoProperty({ required: false })
  chainId?: number

  @IsEnum(ChainEnum)
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
