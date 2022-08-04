import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { DefaultPayinMethodEntity } from '../entities/default-payin-method.entity'
import { PayinMethodEnum } from '../enum/payin.enum'

export class PayinMethodDto {
  @ApiPropertyOptional()
  methodId?: string

  @ApiProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum

  constructor(payinMethodEntity: DefaultPayinMethodEntity) {
    this.methodId = payinMethodEntity.methodId
    this.method = payinMethodEntity.method
  }
}
