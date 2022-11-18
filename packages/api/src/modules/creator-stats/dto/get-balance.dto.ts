import { DtoProperty } from '../../../web/dto.web'
import { EarningCategoryEnum } from '../enum/earning.category.enum'
import { CreatorEarningDto } from './creator-earning.dto'

export class GetAvailableBalanceResponseDto {
  @DtoProperty({ custom_type: Map<EarningCategoryEnum, CreatorEarningDto> })
  earnings: Record<EarningCategoryEnum, CreatorEarningDto>

  constructor(earnings: Record<EarningCategoryEnum, CreatorEarningDto>) {
    this.earnings = earnings
  }
}
