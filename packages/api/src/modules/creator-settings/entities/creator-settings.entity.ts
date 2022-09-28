import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { WELCOME_MESSAGE_MAX_LENGTH } from '../constants/schema'
import { MINIMUM_MESSAGE_TIP_AMOUNT } from '../creator-settings.service'
import { PayoutFrequencyEnum } from '../enum/payout-frequency.enum'

@Entity({ tableName: 'creator_settings' })
export class CreatorSettingsEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @Property({
    columnType: USD_AMOUNT_TYPE,
    default: MINIMUM_MESSAGE_TIP_AMOUNT,
  })
  minimum_tip_amount: number | null

  @Property({ length: WELCOME_MESSAGE_MAX_LENGTH })
  welcome_message: string | null

  @Property({ default: true })
  allow_comments_on_posts: boolean

  @Enum({
    type: () => PayoutFrequencyEnum,
    default: PayoutFrequencyEnum.MANUAL,
  })
  payout_frequency: PayoutFrequencyEnum

  @Property({ default: true })
  show_follower_count: boolean

  @Property({ default: true })
  show_media_count: boolean
}
