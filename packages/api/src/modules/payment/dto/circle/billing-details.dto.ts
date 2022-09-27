import { Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { USER_LEGAL_FULL_NAME_LENGTH } from '../../../user/constants/schema'

export class BillingDetailsDto {
  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string

  @DtoProperty({ type: 'string' })
  city: string

  @DtoProperty({ type: 'string' })
  country: string

  @DtoProperty({ type: 'string' })
  line1: string

  @DtoProperty({ type: 'string', optional: true })
  line2?: string

  @DtoProperty({ type: 'string', optional: true })
  district?: string

  @DtoProperty({ type: 'string' })
  postalCode: string
}
