import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CreatorSettingsEntity } from '../entities/creator-settings.entity'
import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

export class CreatorSettingsDto {
  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true })
  minimumTipAmount: number | null

  @DtoProperty({ custom_type: PayoutFrequencyEnum })
  payoutFrequency: PayoutFrequencyEnum

  @DtoProperty({ type: 'boolean' })
  welcomeMessage: boolean

  @DtoProperty({ type: 'boolean' })
  allowCommentsOnPosts: boolean

  @DtoProperty({ type: 'boolean' })
  showFollowerCount: boolean

  @DtoProperty({ type: 'boolean' })
  showMediaCount: boolean

  @DtoProperty({ type: 'boolean' })
  showLikeCount: boolean

  @DtoProperty({ type: 'boolean' })
  showPostCount: boolean

  constructor(creatorSettings: CreatorSettingsEntity | undefined) {
    if (creatorSettings) {
      this.minimumTipAmount = creatorSettings.minimum_tip_amount
      this.payoutFrequency = creatorSettings.payout_frequency
      this.welcomeMessage = creatorSettings.welcome_message
      this.allowCommentsOnPosts = creatorSettings.allow_comments_on_posts
      this.showFollowerCount = creatorSettings.show_follower_count
      this.showMediaCount = creatorSettings.show_media_count
      this.showLikeCount = creatorSettings.show_like_count
      this.showPostCount = creatorSettings.show_post_count
    }
  }
}
