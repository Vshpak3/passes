import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

export class CreatorSettingsDto {
  @ApiProperty()
  minimumTipAmount: number

  @ApiProperty({ enum: PayoutFrequencyEnum })
  payoutFrequency: PayoutFrequencyEnum

  @ApiPropertyOptional()
  welcomeMessage?: string

  constructor(creatorSettings) {
    if (creatorSettings) {
      this.minimumTipAmount = creatorSettings.minimum_tip_amount
      this.payoutFrequency = creatorSettings.payout_frequency
      this.welcomeMessage = creatorSettings.welcome_message
    }
  }
}
