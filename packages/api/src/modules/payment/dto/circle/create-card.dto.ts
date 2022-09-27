import { DtoProperty } from '../../../../web/dto.web'
import { BillingDetailsDto } from './billing-details.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreateCardDto {
  @DtoProperty({ type: 'string' })
  idempotencyKey: string

  @DtoProperty({ type: 'string' })
  keyId: string

  @DtoProperty({ type: 'string' })
  encryptedData: string

  @DtoProperty({ custom_type: BillingDetailsDto })
  billingDetails: BillingDetailsDto

  @DtoProperty({ type: 'number' })
  expMonth: number

  @DtoProperty({ type: 'number' })
  expYear: number

  @DtoProperty({ custom_type: CircleMetaDataDto })
  metadata: CircleMetaDataDto
}

export class CircleCreateCardAndExtraRequestDto {
  @DtoProperty({ custom_type: CircleCreateCardDto })
  createCardDto: CircleCreateCardDto

  @DtoProperty({ type: 'string' })
  cardNumber: string
}
