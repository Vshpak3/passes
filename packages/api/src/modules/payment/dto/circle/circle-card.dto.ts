import { Length, Max, Min } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { USER_LEGAL_FULL_NAME_LENGTH } from '../../../user/constants/schema'
import { CircleAccountStatusEnum } from '../../enum/circle-account.status.enum'

export class CircleCardDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid', optional: true })
  circleId?: string

  @DtoProperty({ custom_type: CircleAccountStatusEnum })
  status: CircleAccountStatusEnum

  @Length(1, 1)
  @DtoProperty({ type: 'string' })
  firstDigit: string

  @Length(4, 4)
  @DtoProperty({ type: 'string' })
  fourDigits: string

  @Min(1)
  @Max(12)
  @DtoProperty({ type: 'number' })
  expMonth: number

  @Min(2000)
  @DtoProperty({ type: 'number' })
  expYear: number

  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string

  @DtoProperty({ type: 'boolean' })
  active: boolean

  constructor(card) {
    if (card) {
      this.id = card.id
      this.circleId = card.circle_id
      this.status = card.status
      this.firstDigit = card.card_number.slice(0, 1)
      this.fourDigits = card.card_number.slice(12)
      this.expMonth = card.exp_month
      this.expYear = card.exp_year
      this.active = card.active
      this.name = card.name
    }
  }
}
