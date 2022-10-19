import { Entity, Index, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { MESSAGE_LENGTH } from '../constants/schema'

@Entity()
export class ChannelEntity extends BaseEntity {
  static table = 'channel'

  @Index()
  @Property({ length: 3 })
  recent: Date | null

  @Property({ length: MESSAGE_LENGTH })
  preview_text: string | null
}
