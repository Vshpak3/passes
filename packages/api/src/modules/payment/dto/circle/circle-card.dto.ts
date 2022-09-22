import { IsEnum, IsInt, IsUUID, Length, Max, Min } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { USER_LEGAL_FULL_NAME_LENGTH } from '../../../user/constants/schema'
import { CircleAccountStatusEnum } from '../../enum/circle-account.status.enum'

export class CircleCardDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty({ optional: true })
  circleId?: string

  @IsEnum(CircleAccountStatusEnum)
  @DtoProperty({ enum: CircleAccountStatusEnum })
  status: CircleAccountStatusEnum

  @Length(1, 1)
  @DtoProperty()
  firstDigit: string

  @Length(4, 4)
  @DtoProperty()
  fourDigits: string

  @IsInt()
  @Min(1)
  @Max(12)
  @DtoProperty()
  expMonth: number

  @IsInt()
  @Min(2000)
  @DtoProperty()
  expYear: number

  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
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
      this.name = card.name
    }
  }
}
