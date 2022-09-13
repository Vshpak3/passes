import { IsInt, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayoutDto } from './payout.dto'

export class GetPayoutsRequestDto {
  @IsInt()
  @Min(0)
  @DtoProperty()
  offset: number

  @IsInt()
  @Min(1)
  @DtoProperty()
  limit: number
}

export class GetPayoutsResponseDto {
  @IsInt()
  @Min(0)
  @DtoProperty()
  count: number

  @DtoProperty({ type: [PayoutDto] })
  payouts: PayoutDto[]
}
