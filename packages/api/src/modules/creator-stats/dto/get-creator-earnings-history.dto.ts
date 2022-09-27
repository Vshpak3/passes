import { DtoProperty } from '../../../web/dto.web'
import { EarningTypeEnum } from '../enum/earning.type.enum'

export class GetCreatorEarningsHistoryRequestDto {
  @DtoProperty({ type: 'date' })
  start: Date

  @DtoProperty({ type: 'date' })
  end: Date

  @DtoProperty({ custom_type: EarningTypeEnum })
  type?: EarningTypeEnum
}
