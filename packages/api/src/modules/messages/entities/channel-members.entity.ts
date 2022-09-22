import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { ChannelEntity } from './channel.entity'

@Entity({ tableName: 'channel_member' })
@Unique({ properties: ['channel', 'user'] })
@Unique({ properties: ['user', 'otherUser'] })
export class ChannelMemberEntity extends BaseEntity {
  @ManyToOne()
  channel: ChannelEntity

  @ManyToOne()
  user: UserEntity

  @ManyToOne()
  otherUser: UserEntity

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  tipSent: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  tipReceived: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  unreadTip: number

  @Property({ default: false })
  unread: boolean

  @Property({ default: false })
  unlimitedMessages: boolean
}
