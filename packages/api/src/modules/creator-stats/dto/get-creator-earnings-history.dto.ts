import { IsEnum } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { EarningTypeEnum } from '../enum/earning.type.enum'

export class GetCreatorEarningsHistoryRequestDto {
  @DtoProperty()
  start: Date

  @DtoProperty()
  end: Date

  @IsEnum(EarningTypeEnum)
  @DtoProperty({ enum: EarningTypeEnum })
  type?: EarningTypeEnum
}
