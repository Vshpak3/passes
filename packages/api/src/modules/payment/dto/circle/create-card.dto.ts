import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'
import { BillingDetailsDto } from './billing-details.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreateCardDto {
  @DtoProperty()
  idempotencyKey: string

  @IsUUID()
  @DtoProperty()
  keyId: string

  @DtoProperty()
  encryptedData: string

  @DtoProperty()
  billingDetails: BillingDetailsDto

  @DtoProperty()
  expMonth: number

  @DtoProperty()
  expYear: number

  @DtoProperty()
  metadata: CircleMetaDataDto
}

export class CircleCreateCardAndExtraRequestDto {
  @DtoProperty()
  createCardDto: CircleCreateCardDto

  @DtoProperty()
  cardNumber: string
}
