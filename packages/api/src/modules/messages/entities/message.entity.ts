import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CONTENTS_LENGTH } from '../../content/constants/schema'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { MESSAGE_LENGTH } from '../constants/schema'
import { ChannelEntity } from './channel.entity'
import { PaidMessageEntity } from './paid-message.entity'

@Entity()
@Index({ properties: ['created_at'] })
export class MessageEntity extends BaseEntity {
  static table = 'message'

  @ManyToOne({ entity: () => UserEntity })
  sender_id: string

  @Property({ type: types.text, length: MESSAGE_LENGTH })
  text: string

  @Property({ length: CONTENTS_LENGTH, default: '[]' })
  contents: string

  @Property({ default: 0 })
  preview_index: number

  @Property()
  has_content: boolean

  @ManyToOne({ entity: () => ChannelEntity })
  channel_id: string

  @Property()
  tip_amount: number

  @Property()
  pending: boolean

  @Property()
  paid_at: Date | null

  @ManyToOne({ entity: () => UserEntity })
  payer_id: string | null

  @Property({ default: false })
  paying: boolean

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  price: number

  @Property({ default: false })
  reverted: boolean

  @ManyToOne({ entity: () => MessageEntity })
  reply_id: string | null

  @ManyToOne({ entity: () => PaidMessageEntity })
  paid_message_id: string | null

  @Index()
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP(3)', length: 3 })
  sent_at: Date

  @Property({ default: false })
  content_processed: boolean

  @Property({ length: 3 })
  deleted_at: Date | null

  @Property({ default: false })
  automatic: boolean

  @Index()
  @Property({ length: 3 })
  read_at: Date | null
}
