import { ApiProperty } from '@nestjs/swagger'

import { EarningTypeEnum } from '../enum/earning.type.enum'

export class CreatorEarningDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  amount: number

  @ApiProperty()
  type: EarningTypeEnum

  @ApiProperty()
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
