import { ApiProperty } from '@nestjs/swagger'

import { BillingDetailsDto } from './billing-details.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreateCardDto {
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
  metadata: CircleMetaDataDto
}

export class CircleCreateCardAndExtraDto {
  @ApiProperty()
  createCardDto: CircleCreateCardDto

  @ApiProperty()
  fourDigits: string
}
