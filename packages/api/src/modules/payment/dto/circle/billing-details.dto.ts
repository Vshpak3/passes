import { Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { USER_LEGAL_FULL_NAME_LENGTH } from '../../../user/constants/schema'

export class BillingDetailsDto {
  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty()
  name: string

  @DtoProperty()
  city: string

  @DtoProperty()
  country: string

  @DtoProperty()
  line1: string

  @DtoProperty({ optional: true })
  line2?: string

  @DtoProperty({ optional: true })
  district?: string

  @DtoProperty()
  postalCode: string
}
