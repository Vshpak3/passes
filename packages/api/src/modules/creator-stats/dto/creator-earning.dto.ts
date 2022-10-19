import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CreatorEarningEntity } from '../entities/creator-earning.entity'
import { EarningCategoryEnum } from '../enum/earning.category.enum'
import { EarningTypeEnum } from '../enum/earning.type.enum'

export class CreatorEarningDto {
  @DtoProperty({ type: 'uuid' })
  userId: string

  @Min(0)
  @DtoProperty({ type: 'currency' })
  amount: number

  @DtoProperty({ custom_type: EarningTypeEnum })
  type: EarningTypeEnum

  @DtoProperty({ custom_type: EarningCategoryEnum })
  category: EarningCategoryEnum

  @DtoProperty({ type: 'date' })
  createdAt: Date

  constructor(creatorEarning: CreatorEarningEntity | undefined) {
    if (creatorEarning) {
      this.userId = creatorEarning.user_id
      this.amount = creatorEarning.amount
      this.type = creatorEarning.type
      this.category = creatorEarning.category
      this.createdAt = creatorEarning.created_at
    }
  }
}
