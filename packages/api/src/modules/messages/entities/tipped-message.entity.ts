import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CHANNEL_ID_LENGTH, MESSAGE_LENGTH } from '../constants/schema'

@Entity({ tableName: 'tipped_message' })
@Index({ properties: ['createdAt'] })
export class TippedMessageEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  sender: UserEntity

  @Property({ type: types.text, length: MESSAGE_LENGTH })
  text: string

  @Property({ type: types.json })
  attachmentsJSON: string

  @Property({ length: CHANNEL_ID_LENGTH })
  channelId: string

  @Property()
  tipAmount: number

  @Property()
  pending: boolean

  @Property()
  messageId?: string
}
