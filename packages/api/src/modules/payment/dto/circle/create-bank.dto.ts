import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { BillingDetailsDto } from './billing-details.dto'

export class BankAddressDto {
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

  @ApiProperty()
  district?: string
}

export class CreateBankDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiProperty()
  accountNumber: string

  @ApiProperty()
  routingNumber: string

  @ApiProperty()
  billingDetails: BillingDetailsDto

  @ApiProperty()
  bankAddress: BankAddressDto
}
