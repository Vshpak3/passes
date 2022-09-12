import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { CHANNEL_ID_LENGTH } from '../constants/schema'

@Entity({ tableName: 'channel_stat' })
@Unique({ properties: ['channelId', 'user'] })
export class ChannelStatEntity extends BaseEntity {
  @Property({ length: CHANNEL_ID_LENGTH })
  channelId: string

  @ManyToOne()
  user: UserEntity

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  tipSent: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  tipReceived: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  unreadTip: number
}
