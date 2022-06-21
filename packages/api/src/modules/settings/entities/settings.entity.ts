import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class Settings extends BaseEntity {
  @Property()
  userId: number
}
