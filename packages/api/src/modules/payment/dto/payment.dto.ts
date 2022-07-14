import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PaymentDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  type: string
  @ApiProperty()
  amount: {
    amount: string
    currency: string
  }
  @ApiProperty()
  source: {
    type: string

    //for crypto payments
    address?: string
    chain?: string

    //for all other payments
    id?: string
  }
  @ApiProperty()
  status: string
  @ApiProperty()
  merchantId: string
  @ApiProperty()
  merchantWalletId: string
  @ApiPropertyOptional()
  description?: string
}
