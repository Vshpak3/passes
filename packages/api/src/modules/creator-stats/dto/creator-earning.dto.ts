import { IsEnum, IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { EarningTypeEnum } from '../enum/earning.type.enum'

export class CreatorEarningDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @Min(0)
  @DtoProperty()
  amount: number

  @IsEnum(EarningTypeEnum)
  @DtoProperty({ enum: EarningTypeEnum })
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
