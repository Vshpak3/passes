import { ApiProperty } from '@nestjs/swagger'

import { PayoutDto } from './payout.dto'

export class PayoutListRequestDto {
  @ApiProperty()
  offset: number

  @ApiProperty()
  limit: number
}

export class PayoutListResponseDto {
  @ApiProperty()
  count: number

  @ApiProperty({ type: [PayoutDto] })
  payouts: Array<PayoutDto>
}
