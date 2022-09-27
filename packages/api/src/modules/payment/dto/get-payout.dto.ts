import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayoutDto } from './payout.dto'

export class GetPayoutsRequestDto {
  @Min(0)
  @DtoProperty({ type: 'number' })
  offset: number

  @Min(1)
  @DtoProperty({ type: 'number' })
  limit: number
}

export class GetPayoutsResponseDto {
  @Min(0)
  @DtoProperty({ type: 'number' })
  count: number

  @DtoProperty({ custom_type: [PayoutDto] })
  payouts: PayoutDto[]
}
