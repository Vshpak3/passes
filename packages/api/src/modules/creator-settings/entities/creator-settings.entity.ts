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
  user: UserEntity

  @Property({
    columnType: USD_AMOUNT_TYPE,
    default: MINIMUM_MESSAGE_TIP_AMOUNT,
  })
  minimumTipAmount?: number

  @Property({ length: WELCOME_MESSAGE_MAX_LENGTH })
  welcomeMessage?: string

  @Property({ default: true })
  allowCommentsOnPosts: boolean

  @Enum({
    type: () => PayoutFrequencyEnum,
    default: PayoutFrequencyEnum.MANUAL,
  })
  payoutFrequency: PayoutFrequencyEnum
}
