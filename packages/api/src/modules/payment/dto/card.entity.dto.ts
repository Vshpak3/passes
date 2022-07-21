import { ApiProperty } from '@nestjs/swagger'

import { CardEntity } from '../entities/card.entity'

export class CardEntityDto {
  @ApiProperty()
  circleCardId: string

  @ApiProperty()
  status: string

  @ApiProperty()
  isDefault: boolean

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

  constructor(cardEntity?: CardEntity) {
    if (cardEntity !== undefined) {
      this.circleCardId = cardEntity.circleCardId
      this.status = cardEntity.status
      this.isDefault = cardEntity.isDefault
      this.fourDigits = cardEntity.fourDigits
      this.expMonth = cardEntity.expMonth
      this.expYear = cardEntity.expYear
      this.active = cardEntity.active
    } else {
      this.circleCardId = ''
    }
  }
}
