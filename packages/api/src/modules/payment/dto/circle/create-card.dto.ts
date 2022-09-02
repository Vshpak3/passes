import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { BillingDetailsDto } from './billing-details.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreateCardDto {
  @ApiProperty()
  idempotencyKey: string

  @IsUUID()
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

export class CircleCreateCardAndExtraRequestDto {
  @ApiProperty()
  createCardDto: CircleCreateCardDto

  @ApiProperty()
  cardNumber: string
}
