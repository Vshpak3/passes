import { IsEnum, IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { CircleAccountStatusEnum } from '../../enum/circle-account.status.enum'

export class CircleBankDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty({ optional: true })
  circleId?: string

  @IsEnum(CircleAccountStatusEnum)
  @DtoProperty({ enum: CircleAccountStatusEnum })
  status: CircleAccountStatusEnum

  @DtoProperty()
  description: string

  @DtoProperty()
  country: string

  constructor(bank) {
    if (bank) {
      this.id = bank.id
      this.circleId = bank.circle_id
      this.status = bank.status
      this.description = bank.description
      this.country = bank.country
    }
  }
}
