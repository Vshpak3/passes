import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { WELCOME_MESSAGE_MAX_LENGTH } from '../constants/schema'
import { CreatorSettingsEntity } from '../entities/creator-settings.entity'
import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

export class CreatorSettingsDto {
  @Min(0)
  @DtoProperty({ type: 'number', nullable: true })
  minimumTipAmount: number | null

  @DtoProperty({ custom_type: PayoutFrequencyEnum })
  payoutFrequency: PayoutFrequencyEnum

  @Length(1, WELCOME_MESSAGE_MAX_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  welcomeMessage: string | null

  @DtoProperty({ type: 'boolean' })
  allowCommentsOnPosts: boolean

  @DtoProperty({ type: 'boolean' })
  showFollowerCount: boolean

  @DtoProperty({ type: 'boolean' })
  showMediaCount: boolean

  constructor(creatorSettings: CreatorSettingsEntity | undefined) {
    if (creatorSettings) {
      this.minimumTipAmount = creatorSettings.minimum_tip_amount
      this.payoutFrequency = creatorSettings.payout_frequency
      this.welcomeMessage = creatorSettings.welcome_message
      this.allowCommentsOnPosts = creatorSettings.allow_comments_on_posts
      this.showFollowerCount = creatorSettings.show_follower_count
      this.showMediaCount = creatorSettings.show_media_count
    }
  }
}
