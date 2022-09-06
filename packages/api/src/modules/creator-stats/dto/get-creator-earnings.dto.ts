import { DtoProperty } from '../../../web/dto.web'
import { CreatorEarningDto } from './creator-earning.dto'

export class GetCreatorEarningResponseDto extends CreatorEarningDto {}

export class GetCreatorEarningsResponseDto {
  @DtoProperty({ type: [CreatorEarningDto] })
  earnings: CreatorEarningDto[]

  constructor(earnings: CreatorEarningDto[]) {
    this.earnings = earnings
  }
}
