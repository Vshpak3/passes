import { Entity, Index, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'channel' })
export class ChannelEntity extends BaseEntity {
  @Index()
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  recent: Date
}
