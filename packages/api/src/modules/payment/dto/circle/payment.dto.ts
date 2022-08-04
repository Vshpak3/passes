import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AmountDto, SourceDto } from './circle-utils.dto'

export class PaymentDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  type: string

  @ApiProperty()
  amount: AmountDto

  @ApiProperty()
  source: SourceDto

  @ApiProperty()
  status: string

  @ApiProperty()
  merchantId: string

  @ApiProperty()
  merchantWalletId: string

  @ApiPropertyOptional()
  description?: string
}
