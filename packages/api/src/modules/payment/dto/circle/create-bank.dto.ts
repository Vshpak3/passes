import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { BillingDetailsDto } from './billing-details.dto'

export class CircleBankAddressDto {
  @ApiPropertyOptional()
  bankName?: string

  @ApiPropertyOptional()
  city?: string

  @ApiProperty()
  country: string

  @ApiPropertyOptional()
  line1?: string

  @ApiPropertyOptional()
  line2?: string

  @ApiPropertyOptional()
  district?: string
}

export class CircleCreateBankDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiPropertyOptional()
  accountNumber?: string

  @ApiPropertyOptional()
  routingNumber?: string

  @ApiPropertyOptional()
  iban?: string

  @ApiProperty()
  billingDetails: BillingDetailsDto

  @ApiProperty()
  bankAddress: CircleBankAddressDto
}
