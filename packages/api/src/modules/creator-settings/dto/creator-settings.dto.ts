import { DtoProperty } from '../../../web/dto.web'
import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

export class CreatorSettingsDto {
  @DtoProperty()
  minimumTipAmount: number

  @DtoProperty({ enum: PayoutFrequencyEnum })
  payoutFrequency: PayoutFrequencyEnum

  @DtoProperty({ required: false })
  welcomeMessage?: string

  @DtoProperty({ required: false })
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
