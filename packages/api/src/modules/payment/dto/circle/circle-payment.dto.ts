import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CirclePaymentStatusEnum } from '../../enum/circle-payment.status.enum'
import { CircleAmountDto, CircleSourceDto } from './circle-utils.dto'

export class CirclePaymentDto {
  @IsUUID()
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

  @IsUUID()
  @ApiProperty()
  merchantId: string

  @IsUUID()
  @ApiProperty()
  merchantWalletId: string

  @ApiPropertyOptional()
  description?: string
}
