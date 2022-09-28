import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'channel' })
export class ChannelEntity extends BaseEntity {
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  recent: Date
}
