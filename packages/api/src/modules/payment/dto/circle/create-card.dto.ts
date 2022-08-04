import { ApiProperty } from '@nestjs/swagger'

import { BillingDetailsDto } from './billing-details.dto'
import { MetaData } from './metadata.dto'

export class CreateCardDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiProperty()
  keyId: string

  @ApiProperty()
  encryptedData: string

  @ApiProperty()
  billingDetails: BillingDetailsDto

  @ApiProperty()
  expMonth: number

  @ApiProperty()
  expYear: number

  @ApiProperty()
  metadata: MetaData
}

export class CreateCardAndExtraDto {
  @ApiProperty()
  createCardDto: CreateCardDto

  @ApiProperty()
  fourDigits: string
}
