import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'

export class CircleCardDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty({ required: false })
  circleId?: string

  @DtoProperty()
  status: string

  @DtoProperty()
  firstDigit: string

  @DtoProperty()
  fourDigits: string

  @DtoProperty()
  expMonth: number

  @DtoProperty()
  expYear: number

  @DtoProperty()
  name: string

  @DtoProperty()
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
    }
  }
}
