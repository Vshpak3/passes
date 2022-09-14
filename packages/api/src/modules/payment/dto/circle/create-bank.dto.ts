import { DtoProperty } from '../../../../web/dto.web'
import { BillingDetailsDto } from './billing-details.dto'

class CircleBankAddressDto {
  @DtoProperty({ optional: true })
  bankName?: string

  @DtoProperty({ optional: true })
  city?: string

  @DtoProperty()
  country: string

  @DtoProperty({ optional: true })
  line1?: string

  @DtoProperty({ optional: true })
  line2?: string

  @DtoProperty({ optional: true })
  district?: string
}

export class CircleCreateBankRequestDto {
  @DtoProperty()
  idempotencyKey: string

  @DtoProperty({ optional: true })
  accountNumber?: string

  @DtoProperty({ optional: true })
  routingNumber?: string

  @DtoProperty({ optional: true })
  iban?: string

  @DtoProperty()
  billingDetails: BillingDetailsDto

  @DtoProperty()
  bankAddress: CircleBankAddressDto
}
