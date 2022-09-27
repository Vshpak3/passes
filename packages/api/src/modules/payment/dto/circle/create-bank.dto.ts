import { DtoProperty } from '../../../../web/dto.web'
import { BillingDetailsDto } from './billing-details.dto'

class CircleBankAddressDto {
  @DtoProperty({ type: 'string', optional: true })
  bankName?: string

  @DtoProperty({ type: 'string', optional: true })
  city?: string

  @DtoProperty({ type: 'string' })
  country: string

  @DtoProperty({ type: 'string', optional: true })
  line1?: string

  @DtoProperty({ type: 'string', optional: true })
  line2?: string

  @DtoProperty({ type: 'string', optional: true })
  district?: string
}

export class CircleCreateBankRequestDto {
  @DtoProperty({ type: 'string' })
  idempotencyKey: string

  @DtoProperty({ type: 'string', optional: true })
  accountNumber?: string

  @DtoProperty({ type: 'string', optional: true })
  routingNumber?: string

  @DtoProperty({ type: 'string', optional: true })
  iban?: string

  @DtoProperty({ custom_type: BillingDetailsDto })
  billingDetails: BillingDetailsDto

  @DtoProperty({ custom_type: CircleBankAddressDto })
  bankAddress: CircleBankAddressDto
}
