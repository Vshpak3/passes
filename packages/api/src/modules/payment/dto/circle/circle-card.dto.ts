import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CircleCardDto {
  @ApiProperty()
  id: string

  @ApiPropertyOptional()
  circleCardId?: string

  @ApiProperty()
  status: string

  @ApiProperty()
  firstDigit: string

  @ApiProperty()
  fourDigits: string

  @ApiProperty()
  expMonth: number

  @ApiProperty()
  expYear: number

  @ApiProperty()
  name: string

  @ApiProperty()
  active: boolean

  constructor(card) {
    if (card) {
      this.id = card.id
      this.circleCardId = card.circle_card_id
      this.status = card.status
      this.firstDigit = card.card_number.slice(0, 1)
      this.fourDigits = card.card_number.slice(12)
      this.expMonth = card.exp_month
      this.expYear = card.exp_year
      this.active = card.active
    }
  }
}
