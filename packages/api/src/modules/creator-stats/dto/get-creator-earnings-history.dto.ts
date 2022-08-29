import { ApiProperty } from '@nestjs/swagger'

import { EarningTypeEnum } from '../enum/earning.type.enum'

export class GetCreatorEarningsHistoryRequestDto {
  @ApiProperty()
  start: Date

  @ApiProperty()
  end: Date

  @ApiProperty({ enum: EarningTypeEnum })
  type?: EarningTypeEnum
}
