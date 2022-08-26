import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PayinMethodEnum } from '../enum/payin-method.enum'

export class PayinMethodDto {
  @ApiProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum = PayinMethodEnum.NONE

  @ApiPropertyOptional()
  cardId?: string

  @ApiPropertyOptional()
  chainId?: number

  @ApiPropertyOptional({ enum: ChainEnum })
  chain?: ChainEnum

  constructor(payinMethod) {
    if (payinMethod) {
      this.method = payinMethod.method
      this.cardId = payinMethod.card_id
      this.chainId = payinMethod.chain_id
    }
  }
}
