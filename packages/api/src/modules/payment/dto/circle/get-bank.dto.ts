import { DtoProperty } from '../../../../web/dto.web'
import { CircleBankDto } from './circle-bank.dto'

export class GetCircleBankResponseDto extends CircleBankDto {}

export class GetCircleBanksResponseDto {
  @DtoProperty({ type: [CircleBankDto] })
  banks: CircleBankDto[]

  constructor(banks: CircleBankDto[]) {
    this.banks = banks
  }
}
