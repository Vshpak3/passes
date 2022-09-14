import { IsEnum, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { WELCOME_MESSAGE_MAX_LENGTH } from '../constants/schema'
import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

export class CreatorSettingsDto {
  @Min(0)
  @DtoProperty()
  minimumTipAmount: number

  @IsEnum(PayoutFrequencyEnum)
  @DtoProperty({ enum: PayoutFrequencyEnum })
  payoutFrequency: PayoutFrequencyEnum

  @Length(1, WELCOME_MESSAGE_MAX_LENGTH)
  @DtoProperty({ optional: true })
  welcomeMessage?: string

  @DtoProperty({ optional: true })
  allowCommentsOnPosts?: boolean

  constructor(creatorSettings) {
    if (creatorSettings) {
      this.minimumTipAmount = creatorSettings.minimum_tip_amount
      this.payoutFrequency = creatorSettings.payout_frequency
      this.welcomeMessage = creatorSettings.welcome_message
      this.allowCommentsOnPosts = creatorSettings.allow_comments_on_post
    }
  }
}
