import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { EarningTypeEnum } from '../enum/earning.type.enum'

export class CreatorEarningDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  amount: number

  @DtoProperty()
  type: EarningTypeEnum

  @DtoProperty()
  createdAt: Date

  constructor(creatorEarning) {
    if (creatorEarning) {
      this.userId = creatorEarning.user_id
      this.amount = creatorEarning.amount
      this.type = creatorEarning.type
      this.createdAt = creatorEarning.created_at
    }
  }
}
