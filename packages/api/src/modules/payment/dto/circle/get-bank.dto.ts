import { ApiProperty } from '@nestjs/swagger'

import { CircleBankDto } from './circle-bank.dto'

export class GetCircleBankResponseDto extends CircleBankDto {}

export class GetCircleBanksResponseDto {
  @ApiProperty({ type: [CircleBankDto] })
  banks: CircleBankDto[]

  constructor(banks: CircleBankDto[]) {
    this.banks = banks
  }
}
