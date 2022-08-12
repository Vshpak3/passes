import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CirclePaymentStatusEnum } from '../../enum/circle-payment.status.enum'
import { CircleAmountDto, CircleSourceDto } from './circle-utils.dto'

export class CirclePaymentDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  type: string

  @ApiProperty()
  amount: CircleAmountDto

  @ApiProperty()
  source: CircleSourceDto

  @ApiProperty({ enum: CirclePaymentStatusEnum })
  status: CirclePaymentStatusEnum

  @ApiProperty()
  merchantId: string

  @ApiProperty()
  merchantWalletId: string

  @ApiPropertyOptional()
  description?: string
}
