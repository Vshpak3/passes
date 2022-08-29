import { ApiProperty } from '@nestjs/swagger'

import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

export class CreatorSettingsDto {
  @ApiProperty()
  minimumTipAmount: number

  @ApiProperty({ enum: PayoutFrequencyEnum })
  payoutFrequency: PayoutFrequencyEnum
}
