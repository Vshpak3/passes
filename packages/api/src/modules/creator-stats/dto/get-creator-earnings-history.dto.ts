import { ApiProperty } from '@nestjs/swagger'

import { EarningTypeEnum } from '../enum/earning.type.enum'

export class GetCreatorEarningsHistoryDto {
  @ApiProperty()
  start: Date

  @ApiProperty()
  end: Date

  @ApiProperty()
  type?: EarningTypeEnum
}
