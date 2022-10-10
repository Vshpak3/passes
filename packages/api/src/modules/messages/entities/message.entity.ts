import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { CONTENT_IDS_LENGTH, MESSAGE_LENGTH } from '../constants/schema'
import { ChannelEntity } from './channel.entity'
import { PaidMessageEntity } from './paid-message.entity'

@Entity({ tableName: 'message' })
@Index({ properties: ['created_at'] })
export class MessageEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  sender_id: string

  @Property({ type: types.text, length: MESSAGE_LENGTH })
  text: string

  @Property({ length: CONTENT_IDS_LENGTH, default: '[]' })
  content_ids: string

  @Property()
  has_content: boolean

  @ManyToOne({ entity: () => ChannelEntity })
  channel_id: string

  @Property()
  tip_amount: number

  @Property()
  pending: boolean

  @Property({ default: false })
  paid: boolean

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  price: number

  @Property({ default: false })
  reverted: boolean

  @ManyToOne({ entity: () => MessageEntity })
  reply_id: string | null

  @ManyToOne({ entity: () => PaidMessageEntity })
  paid_message_id: string | null

  @Index()
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  sent_at: Date
}
