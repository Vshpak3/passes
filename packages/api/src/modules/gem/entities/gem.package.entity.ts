import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'gem_package' })
export class GemPackageEntity extends BaseEntity {
  @Property()
  cost: number

  @Property()
  base_gems: number

  @Property()
  bonus_gems: number

  @Property()
  isPublic: boolean

  @Property()
  title: string

  @Property()
  description: string
}
