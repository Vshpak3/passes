import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CONTENT_IDS_LENGTH, MESSAGE_LENGTH } from '../constants/schema'
import { ChannelEntity } from './channel.entity'
import { PaidMessageEntity } from './paid-message.entity'

@Entity({ tableName: 'message' })
@Index({ properties: ['createdAt'] })
export class MessageEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  sender: UserEntity

  @Property({ type: types.text, length: MESSAGE_LENGTH })
  text: string

  @Property({ length: CONTENT_IDS_LENGTH })
  contentIds: string

  @ManyToOne()
  channel: ChannelEntity

  @Property()
  tipAmount: number

  @Property()
  pending: boolean

  @Property({ default: false })
  paid: boolean

  @Property({ default: 0 })
  price?: number

  @Property({ default: false })
  reverted: boolean

  @ManyToOne()
  reply?: MessageEntity

  @ManyToOne()
  paidMessage?: PaidMessageEntity

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  sentAt: Date
}
