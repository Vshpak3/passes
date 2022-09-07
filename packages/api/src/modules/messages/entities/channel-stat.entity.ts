import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { CHANNEL_ID_LENGTH } from '../constants/schema'

@Entity({ tableName: 'channel_stat' })
export class ChannelStatEntity extends BaseEntity {
  @Property({ length: CHANNEL_ID_LENGTH })
  @Unique()
  channelId: string

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  totalTipAmount: number
}
