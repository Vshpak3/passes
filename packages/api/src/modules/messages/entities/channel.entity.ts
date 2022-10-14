import { Entity, Index, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class ChannelEntity extends BaseEntity {
  static table = 'channel'

  @Index()
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  recent: Date
}
