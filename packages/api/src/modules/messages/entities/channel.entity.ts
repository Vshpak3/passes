import { Entity, Index, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class ChannelEntity extends BaseEntity {
  static table = 'channel'

  @Index()
  @Property()
  recent: Date | null
}
