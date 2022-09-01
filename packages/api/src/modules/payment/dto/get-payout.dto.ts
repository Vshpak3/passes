import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

import { PayoutDto } from './payout.dto'

export class GetPayoutsRequestDto {
  @IsInt()
  @Min(0)
  @ApiProperty()
  offset: number

  @IsInt()
  @Min(1)
  @ApiProperty()
  limit: number
}

export class GetPayoutsResponseDto {
  @ApiProperty()
  count: number

  @ApiProperty({ type: [PayoutDto] })
  payouts: Array<PayoutDto>
}
