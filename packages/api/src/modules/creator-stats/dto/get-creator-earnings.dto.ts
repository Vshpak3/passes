import { ApiProperty } from '@nestjs/swagger'

import { CreatorEarningDto } from './creator-earning.dto'

export class GetCreatorEarningResponseDto extends CreatorEarningDto {}

export class GetCreatorEarningsResponseDto {
  @ApiProperty({ type: [CreatorEarningDto] })
  earnings: CreatorEarningDto[]

  constructor(earnings: CreatorEarningDto[]) {
    this.earnings = earnings
  }
}
