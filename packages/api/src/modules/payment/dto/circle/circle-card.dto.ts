import { Length, Max, Min } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { USER_LEGAL_FULL_NAME_LENGTH } from '../../../user/constants/schema'
import { CircleCardEntity } from '../../entities/circle-card.entity'
import { CircleAccountStatusEnum } from '../../enum/circle-account.status.enum'

export class CircleCardDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  circleId?: string | null

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

  constructor(card: CircleCardEntity | undefined) {
    if (card) {
      this.id = card.id
      this.circleId = card.circle_id
      this.status = card.status
      this.firstDigit = card.card_number.slice(0, 1)
      this.fourDigits = card.card_number.slice(12)
      this.expMonth = card.exp_month
      this.expYear = card.exp_year
      this.name = card.name
    }
  }
}
