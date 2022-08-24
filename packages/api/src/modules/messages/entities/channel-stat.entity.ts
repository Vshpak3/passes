import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'channel_stat' })
export class ChannelStatEntity extends BaseEntity {
  @Property()
  @Unique()
  channelId: string

  @Property()
  totalTipAmount: number

  // users are only set for indexing
  @ManyToOne({ entity: () => UserEntity })
  user?: UserEntity

  @ManyToOne({ entity: () => UserEntity })
  otherUser?: UserEntity
}
