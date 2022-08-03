import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodEnum } from '../enum/payin.enum'

export class PayinMethodDto {
  @ApiPropertyOptional()
  methodId?: string
  @ApiProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum
}
