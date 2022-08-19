import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodEnum } from '../enum/payin-method.enum'

export class PayinMethodDto {
  @ApiProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum

  @ApiPropertyOptional()
  cardId?: string

  @ApiPropertyOptional()
  chainId?: number

  constructor(payinMethod) {
    if (payinMethod) {
      this.method = payinMethod.method
      this.cardId = payinMethod.card_id
      this.chainId = payinMethod.chain_id
    }
  }
}
