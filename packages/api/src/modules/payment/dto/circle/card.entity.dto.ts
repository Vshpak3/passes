import { ApiProperty } from '@nestjs/swagger'

import { CircleCardEntity } from '../../entities/circle-card.entity'

export class CardEntityDto {
  @ApiProperty()
  circleCardId: string

  @ApiProperty()
  status: string

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

  constructor(cardEntity?: CircleCardEntity) {
    if (cardEntity !== undefined) {
      this.circleCardId = cardEntity.circleCardId
      this.status = cardEntity.status
      this.fourDigits = cardEntity.fourDigits
      this.expMonth = cardEntity.expMonth
      this.expYear = cardEntity.expYear
      this.active = cardEntity.active
    } else {
      this.circleCardId = ''
    }
  }
}
