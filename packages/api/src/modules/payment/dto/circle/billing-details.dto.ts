import { DtoProperty } from '../../../../web/dto.web'

export class BillingDetailsDto {
  @DtoProperty()
  name: string

  @DtoProperty()
  city: string

  @DtoProperty()
  country: string

  @DtoProperty()
  line1: string

  @DtoProperty({ required: false })
  line2?: string

  @DtoProperty({ required: false })
  district?: string

  @DtoProperty()
  postalCode: string
}
