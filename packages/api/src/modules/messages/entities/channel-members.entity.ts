import { Entity, Index, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { ChannelEntity } from './channel.entity'

@Entity({ tableName: 'channel_member' })
@Unique({ properties: ['channel_id', 'user_id'] })
@Unique({ properties: ['user_id', 'other_user_id'] })
export class ChannelMemberEntity extends BaseEntity {
  @ManyToOne({ entity: () => ChannelEntity })
  channel_id: string

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @ManyToOne({ entity: () => UserEntity })
  other_user_id: string

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  tip_sent: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  tip_received: number

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  unread_tip: number

  @Property({ default: false })
  unread: boolean

  @Property({ default: false })
  unlimited_messages: boolean
}
