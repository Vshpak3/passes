import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'tipped_message' })
@Index({ properties: ['createdAt'] })
export class TippedMessageEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  sender: UserEntity

  @Property({ length: 255 })
  text: string

  @Property({ type: types.json })
  attachmentsJSON: string

  @Property({ length: 255 })
  channelId: string

  @Property()
  tipAmount: number

  @Property()
  pending: boolean

  @Property()
  messageId?: string
}
