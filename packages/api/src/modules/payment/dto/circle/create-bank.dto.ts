import { DtoProperty } from '../../../../web/endpoint.web'
import { BillingDetailsDto } from './billing-details.dto'

class CircleBankAddressDto {
  @DtoProperty({ required: false })
  bankName?: string

  @DtoProperty({ required: false })
  city?: string

  @DtoProperty()
  country: string

  @DtoProperty({ required: false })
  line1?: string

  @DtoProperty({ required: false })
  line2?: string

  @DtoProperty({ required: false })
  district?: string
}

export class CircleCreateBankRequestDto {
  @DtoProperty()
  idempotencyKey: string

  @DtoProperty({ required: false })
  accountNumber?: string

  @DtoProperty({ required: false })
  routingNumber?: string

  @DtoProperty({ required: false })
  iban?: string

  @DtoProperty()
  billingDetails: BillingDetailsDto

  @DtoProperty()
  bankAddress: CircleBankAddressDto
}
