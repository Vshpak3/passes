import { ApiProperty } from '@nestjs/swagger'

import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

export class CreateCreatorSettingsDto {
  @ApiProperty()
  minimumTipAmount: number

  @ApiProperty()
  payoutFrequency: PayoutFrequencyEnum
}
